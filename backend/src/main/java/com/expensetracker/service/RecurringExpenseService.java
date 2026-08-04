package com.expensetracker.service;

import com.expensetracker.dto.ExpenseDto;
import com.expensetracker.dto.RecurringDto;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.model.RecurringExpense;
import com.expensetracker.model.Subcategory;
import com.expensetracker.model.User;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.RecurringExpenseRepository;
import com.expensetracker.repository.SubcategoryRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecurringExpenseService {

    @Autowired
    private RecurringExpenseRepository recurringRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<RecurringDto.RecurringResponse> getRecurringExpensesForUser(Long userId) {
        List<RecurringExpense> list = recurringRepository.findByUserIdOrderByNextDueDateAsc(userId);
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public RecurringDto.RecurringResponse createRecurringExpense(Long userId, RecurringDto.RecurringRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Subcategory subcategory = null;
        if (request.getSubcategoryId() != null) {
            subcategory = subcategoryRepository.findById(request.getSubcategoryId()).orElse(null);
        }

        RecurringExpense item = RecurringExpense.builder()
                .user(user)
                .category(category)
                .subcategory(subcategory)
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : user.getCurrency())
                .frequency(request.getFrequency().toUpperCase())
                .nextDueDate(request.getNextDueDate())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "CARD")
                .notes(request.getNotes())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        RecurringExpense saved = recurringRepository.save(item);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteRecurringExpense(Long userId, Long id) {
        RecurringExpense item = recurringRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring expense rule not found"));
        recurringRepository.delete(item);
    }

    @Transactional
    public ExpenseDto.ExpenseResponse triggerDueRecurringExpense(Long userId, Long recurringId) {
        RecurringExpense item = recurringRepository.findByIdAndUserId(recurringId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring expense rule not found"));

        Expense expense = Expense.builder()
                .user(item.getUser())
                .category(item.getCategory())
                .subcategory(item.getSubcategory())
                .amount(item.getAmount())
                .currency(item.getCurrency())
                .expenseDate(item.getNextDueDate())
                .paymentMethod(item.getPaymentMethod())
                .notes("[Auto-Recurring] " + (item.getNotes() != null ? item.getNotes() : ""))
                .isRecurring(true)
                .recurrenceRule(item.getFrequency())
                .build();

        Expense savedExpense = expenseRepository.save(expense);

        // Advance next due date
        item.setNextDueDate(calculateNextDueDate(item.getNextDueDate(), item.getFrequency()));
        recurringRepository.save(item);

        return ExpenseDto.ExpenseResponse.builder()
                .id(savedExpense.getId())
                .categoryId(savedExpense.getCategory().getId())
                .categoryName(savedExpense.getCategory().getName())
                .amount(savedExpense.getAmount())
                .expenseDate(savedExpense.getExpenseDate())
                .paymentMethod(savedExpense.getPaymentMethod())
                .build();
    }

    @Scheduled(cron = "0 0 1 * * ?") // Daily at 1:00 AM
    @Transactional
    public void processAllDueRecurringExpenses() {
        LocalDate today = LocalDate.now();
        List<RecurringExpense> dueItems = recurringRepository.findByIsActiveTrueAndNextDueDateLessThanEqual(today);

        for (RecurringExpense item : dueItems) {
            Expense expense = Expense.builder()
                    .user(item.getUser())
                    .category(item.getCategory())
                    .subcategory(item.getSubcategory())
                    .amount(item.getAmount())
                    .currency(item.getCurrency())
                    .expenseDate(item.getNextDueDate())
                    .paymentMethod(item.getPaymentMethod())
                    .notes("[Scheduled-Recurring] " + (item.getNotes() != null ? item.getNotes() : ""))
                    .isRecurring(true)
                    .recurrenceRule(item.getFrequency())
                    .build();

            expenseRepository.save(expense);

            item.setNextDueDate(calculateNextDueDate(item.getNextDueDate(), item.getFrequency()));
            recurringRepository.save(item);
        }
    }

    private LocalDate calculateNextDueDate(LocalDate currentDate, String frequency) {
        return switch (frequency.toUpperCase()) {
            case "DAILY" -> currentDate.plusDays(1);
            case "WEEKLY" -> currentDate.plusWeeks(1);
            case "YEARLY" -> currentDate.plusYears(1);
            default -> currentDate.plusMonths(1); // MONTHLY
        };
    }

    private RecurringDto.RecurringResponse mapToResponse(RecurringExpense item) {
        return RecurringDto.RecurringResponse.builder()
                .id(item.getId())
                .categoryId(item.getCategory().getId())
                .categoryName(item.getCategory().getName())
                .categoryColor(item.getCategory().getColor())
                .categoryIcon(item.getCategory().getIcon())
                .subcategoryId(item.getSubcategory() != null ? item.getSubcategory().getId() : null)
                .subcategoryName(item.getSubcategory() != null ? item.getSubcategory().getName() : null)
                .amount(item.getAmount())
                .currency(item.getCurrency())
                .frequency(item.getFrequency())
                .nextDueDate(item.getNextDueDate())
                .paymentMethod(item.getPaymentMethod())
                .notes(item.getNotes())
                .isActive(item.getIsActive())
                .build();
    }
}
