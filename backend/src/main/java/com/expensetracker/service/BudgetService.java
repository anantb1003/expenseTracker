package com.expensetracker.service;

import com.expensetracker.dto.BudgetDto;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Budget;
import com.expensetracker.model.Category;
import com.expensetracker.model.User;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<BudgetDto.BudgetResponse> getBudgetsForMonth(Long userId, Integer month, Integer year) {
        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year);
        return budgets.stream().map(b -> buildBudgetResponse(userId, b)).collect(Collectors.toList());
    }

    @Transactional
    public BudgetDto.BudgetResponse setBudget(Long userId, BudgetDto.BudgetRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        }

        Optional<Budget> existing = request.getCategoryId() != null ?
                budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(userId, request.getCategoryId(), request.getMonth(), request.getYear()) :
                budgetRepository.findByUserIdAndCategoryIsNullAndMonthAndYear(userId, request.getMonth(), request.getYear());

        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setAmount(request.getAmount());
        } else {
            budget = Budget.builder()
                    .user(user)
                    .category(category)
                    .month(request.getMonth())
                    .year(request.getYear())
                    .amount(request.getAmount())
                    .build();
        }

        Budget saved = budgetRepository.save(budget);
        return buildBudgetResponse(userId, saved);
    }

    @Transactional
    public void deleteBudget(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        budgetRepository.delete(budget);
    }

    public List<BudgetDto.BudgetResponse> getBudgetAlerts(Long userId, Integer month, Integer year) {
        List<BudgetDto.BudgetResponse> allBudgets = getBudgetsForMonth(userId, month, year);
        return allBudgets.stream()
                .filter(b -> b.getPercentageUsed() >= 80.0)
                .collect(Collectors.toList());
    }

    private BudgetDto.BudgetResponse buildBudgetResponse(Long userId, Budget budget) {
        YearMonth yearMonth = YearMonth.of(budget.getYear(), budget.getMonth());
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        BigDecimal spentAmount;
        if (budget.getCategory() != null) {
            BigDecimal sum = expenseRepository.sumByCategoryAndDateBetween(userId, budget.getCategory().getId(), startDate, endDate);
            spentAmount = sum != null ? sum : BigDecimal.ZERO;
        } else {
            BigDecimal sum = expenseRepository.sumTotalByUserIdAndDateBetween(userId, startDate, endDate);
            spentAmount = sum != null ? sum : BigDecimal.ZERO;
        }

        BigDecimal budgetAmount = budget.getAmount();
        BigDecimal remainingAmount = budgetAmount.subtract(spentAmount);

        double percentageUsed = budgetAmount.compareTo(BigDecimal.ZERO) > 0 ?
                spentAmount.multiply(new BigDecimal(100)).divide(budgetAmount, 2, RoundingMode.HALF_UP).doubleValue() : 0.0;

        String alertStatus = "NORMAL";
        if (percentageUsed >= 100.0) {
            alertStatus = "CRITICAL_100";
        } else if (percentageUsed >= 80.0) {
            alertStatus = "WARNING_80";
        }

        return BudgetDto.BudgetResponse.builder()
                .id(budget.getId())
                .categoryId(budget.getCategory() != null ? budget.getCategory().getId() : null)
                .categoryName(budget.getCategory() != null ? budget.getCategory().getName() : "Overall Budget")
                .categoryColor(budget.getCategory() != null ? budget.getCategory().getColor() : "#3B82F6")
                .categoryIcon(budget.getCategory() != null ? budget.getCategory().getIcon() : "DollarSign")
                .month(budget.getMonth())
                .year(budget.getYear())
                .budgetAmount(budgetAmount)
                .spentAmount(spentAmount)
                .remainingAmount(remainingAmount)
                .percentageUsed(percentageUsed)
                .alertStatus(alertStatus)
                .build();
    }
}
