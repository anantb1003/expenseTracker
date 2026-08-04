package com.expensetracker.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

public class AnalyticsDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DashboardSummary {
        private BigDecimal spentToday;
        private BigDecimal spentThisWeek;
        private BigDecimal spentThisMonth;
        private String topCategoryName;
        private BigDecimal topCategoryAmount;
        private BigDecimal monthlyBudgetAmount;
        private BigDecimal monthlyBudgetSpent;
        private Double monthlyBudgetPercentage;
        private List<BudgetDto.BudgetResponse> budgetAlerts;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategorySpendBreakdown {
        private Long categoryId;
        private String categoryName;
        private String categoryColor;
        private String categoryIcon;
        private BigDecimal amount;
        private Double percentage;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlySpendTrend {
        private String monthLabel; // e.g. "Jan 2026"
        private Integer year;
        private Integer month;
        private BigDecimal totalAmount;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailySpendTrend {
        private String date; // YYYY-MM-DD
        private BigDecimal totalAmount;
    }
}
