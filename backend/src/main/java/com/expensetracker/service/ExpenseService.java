package com.expensetracker.service;

import com.expensetracker.dto.AuditLogDto;
import com.expensetracker.dto.ExpenseDto;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.model.ExpenseAuditLog;
import com.expensetracker.model.Subcategory;
import com.expensetracker.model.User;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseAuditLogRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.SubcategoryRepository;
import com.expensetracker.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ExpenseAuditLogRepository auditLogRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<ExpenseDto.ExpenseResponse> getExpenses(
            Long userId,
            LocalDate startDate,
            LocalDate endDate,
            Long categoryId,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            String searchKeyword,
            String paymentMethod,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Expense> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("user").get("id"), userId));

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("expenseDate"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("expenseDate"), endDate));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (minAmount != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("amount"), minAmount));
            }
            if (maxAmount != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("amount"), maxAmount));
            }
            if (paymentMethod != null && !paymentMethod.isBlank()) {
                predicates.add(cb.equal(root.get("paymentMethod"), paymentMethod.toUpperCase()));
            }
            if (searchKeyword != null && !searchKeyword.isBlank()) {
                String pattern = "%" + searchKeyword.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("notes")), pattern));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Expense> expensePage = expenseRepository.findAll(spec, pageable);
        return expensePage.map(this::mapToResponse);
    }

    public ExpenseDto.ExpenseResponse getExpenseById(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + expenseId));
        return mapToResponse(expense);
    }

    @Transactional
    public ExpenseDto.ExpenseResponse createExpense(Long userId, ExpenseDto.ExpenseRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Subcategory subcategory = null;
        if (request.getSubcategoryId() != null) {
            subcategory = subcategoryRepository.findById(request.getSubcategoryId()).orElse(null);
        }

        Expense expense = Expense.builder()
                .user(user)
                .category(category)
                .subcategory(subcategory)
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : user.getCurrency())
                .expenseDate(request.getExpenseDate())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "UPI")
                .notes(request.getNotes())
                .receiptUrl(request.getReceiptUrl())
                .isRecurring(request.getIsRecurring() != null ? request.getIsRecurring() : false)
                .recurrenceRule(request.getRecurrenceRule())
                .build();

        Expense saved = expenseRepository.save(expense);

        // Record Audit History Log
        auditLogRepository.save(ExpenseAuditLog.builder()
                .user(user)
                .expenseId(saved.getId())
                .actionType("CREATE")
                .details(String.format("Logged new expense of ₹%.2f in '%s' (%s)", saved.getAmount(), category.getName(), saved.getPaymentMethod()))
                .build());

        return mapToResponse(saved);
    }

    @Transactional
    public ExpenseDto.ExpenseResponse updateExpense(Long userId, Long expenseId, ExpenseDto.ExpenseRequest request) {
        Expense expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Subcategory subcategory = null;
        if (request.getSubcategoryId() != null) {
            subcategory = subcategoryRepository.findById(request.getSubcategoryId()).orElse(null);
        }

        BigDecimal oldAmount = expense.getAmount();
        String oldCategoryName = expense.getCategory().getName();

        expense.setCategory(category);
        expense.setSubcategory(subcategory);
        expense.setAmount(request.getAmount());
        if (request.getCurrency() != null) expense.setCurrency(request.getCurrency());
        expense.setExpenseDate(request.getExpenseDate());
        if (request.getPaymentMethod() != null) expense.setPaymentMethod(request.getPaymentMethod().toUpperCase());
        expense.setNotes(request.getNotes());
        expense.setReceiptUrl(request.getReceiptUrl());
        if (request.getIsRecurring() != null) expense.setIsRecurring(request.getIsRecurring());
        expense.setRecurrenceRule(request.getRecurrenceRule());

        Expense updated = expenseRepository.save(expense);

        // Record Audit History Log
        auditLogRepository.save(ExpenseAuditLog.builder()
                .user(expense.getUser())
                .expenseId(updated.getId())
                .actionType("UPDATE")
                .details(String.format("Updated expense #%d from ₹%.2f ('%s') to ₹%.2f ('%s')",
                        updated.getId(), oldAmount, oldCategoryName, updated.getAmount(), category.getName()))
                .build());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteExpense(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        // Record Audit History Log before deleting
        auditLogRepository.save(ExpenseAuditLog.builder()
                .user(expense.getUser())
                .expenseId(expense.getId())
                .actionType("DELETE")
                .details(String.format("Deleted expense #%d of ₹%.2f from '%s' (%s)",
                        expense.getId(), expense.getAmount(), expense.getCategory().getName(), expense.getExpenseDate()))
                .build());

        expenseRepository.delete(expense);
    }

    @Transactional
    public void bulkDeleteExpenses(Long userId, List<Long> ids) {
        if (ids != null && !ids.isEmpty()) {
            User user = userRepository.findById(userId).orElseThrow();
            expenseRepository.deleteAllByUserIdAndIdIn(userId, ids);

            auditLogRepository.save(ExpenseAuditLog.builder()
                    .user(user)
                    .actionType("BULK_DELETE")
                    .details(String.format("Bulk deleted %d expense records (IDs: %s)", ids.size(), ids.toString()))
                    .build());
        }
    }

    @Transactional
    public void bulkRecategorize(Long userId, List<Long> ids, Long newCategoryId) {
        Category newCategory = categoryRepository.findById(newCategoryId)
                .orElseThrow(() -> new ResourceNotFoundException("New category not found"));

        if (ids != null && !ids.isEmpty()) {
            User user = userRepository.findById(userId).orElseThrow();
            expenseRepository.updateCategoryForExpenses(userId, ids, newCategory.getId());

            auditLogRepository.save(ExpenseAuditLog.builder()
                    .user(user)
                    .actionType("BULK_RECATEGORIZE")
                    .details(String.format("Re-categorized %d expenses to '%s'", ids.size(), newCategory.getName()))
                    .build());
        }
    }

    @Transactional
    public int importCsv(Long userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded CSV file is empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Category> availableCategories = categoryRepository.findAllAvailableForUser(userId);
        Category defaultCategory = availableCategories.stream().findFirst()
                .orElseThrow(() -> new BadRequestException("No available categories"));

        int importedCount = 0;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {

            for (CSVRecord record : csvParser) {
                try {
                    String dateStr = record.get("Date");
                    String amountStr = record.get("Amount");
                    String categoryName = record.isMapped("Category") ? record.get("Category") : "";
                    String paymentMethod = record.isMapped("PaymentMethod") ? record.get("PaymentMethod") : "UPI";
                    String notes = record.isMapped("Notes") ? record.get("Notes") : "";

                    LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
                    BigDecimal amount = new BigDecimal(amountStr);

                    Category category = availableCategories.stream()
                            .filter(c -> c.getName().equalsIgnoreCase(categoryName))
                            .findFirst()
                            .orElse(defaultCategory);

                    Expense expense = Expense.builder()
                            .user(user)
                            .category(category)
                            .amount(amount)
                            .currency(user.getCurrency())
                            .expenseDate(date)
                            .paymentMethod(paymentMethod.toUpperCase())
                            .notes(notes)
                            .isRecurring(false)
                            .build();

                    expenseRepository.save(expense);
                    importedCount++;
                } catch (Exception e) {
                    // Skip malformed rows safely
                }
            }

            auditLogRepository.save(ExpenseAuditLog.builder()
                    .user(user)
                    .actionType("IMPORT")
                    .details(String.format("Bulk imported %d expense records from CSV file '%s'", importedCount, file.getOriginalFilename()))
                    .build());

        } catch (Exception e) {
            throw new BadRequestException("Failed to parse CSV file: " + e.getMessage());
        }

        return importedCount;
    }

    public Page<AuditLogDto.LogResponse> getAuditHistory(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ExpenseAuditLog> logs = auditLogRepository.findByUserIdOrderByTimestampDesc(userId, pageable);
        return logs.map(l -> AuditLogDto.LogResponse.builder()
                .id(l.getId())
                .expenseId(l.getExpenseId())
                .actionType(l.getActionType())
                .details(l.getDetails())
                .timestamp(l.getTimestamp())
                .build());
    }

    public ExpenseDto.ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseDto.ExpenseResponse.builder()
                .id(expense.getId())
                .categoryId(expense.getCategory().getId())
                .categoryName(expense.getCategory().getName())
                .categoryColor(expense.getCategory().getColor())
                .categoryIcon(expense.getCategory().getIcon())
                .subcategoryId(expense.getSubcategory() != null ? expense.getSubcategory().getId() : null)
                .subcategoryName(expense.getSubcategory() != null ? expense.getSubcategory().getName() : null)
                .amount(expense.getAmount())
                .currency(expense.getCurrency())
                .expenseDate(expense.getExpenseDate())
                .paymentMethod(expense.getPaymentMethod())
                .notes(expense.getNotes())
                .receiptUrl(expense.getReceiptUrl())
                .isRecurring(expense.getIsRecurring())
                .recurrenceRule(expense.getRecurrenceRule())
                .createdAt(expense.getCreatedAt())
                .build();
    }
}
