package com.expensetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

public class BudgetDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BudgetRequest {
        private Long categoryId; // NULL means overall monthly budget

        @NotNull(message = "Month is required")
        @Min(1) @Max(12)
        private Integer month;

        @NotNull(message = "Year is required")
        @Min(2000)
        private Integer year;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Budget amount must be greater than 0")
        private BigDecimal amount;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BudgetResponse {
        private Long id;
        private Long categoryId;
        private String categoryName;
        private String categoryColor;
        private String categoryIcon;
        private Integer month;
        private Integer year;
        private BigDecimal budgetAmount;
        private BigDecimal spentAmount;
        private BigDecimal remainingAmount;
        private Double percentageUsed;
        private String alertStatus; // NORMAL, WARNING_80, CRITICAL_100
    }
}
