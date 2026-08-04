package com.expensetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RecurringDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecurringRequest {
        @NotNull(message = "Category is required")
        private Long categoryId;

        private Long subcategoryId;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        private BigDecimal amount;

        private String currency = "USD";

        @NotBlank(message = "Frequency is required")
        private String frequency; // DAILY, WEEKLY, MONTHLY, YEARLY

        @NotNull(message = "Next due date is required")
        private LocalDate nextDueDate;

        private String paymentMethod = "CARD";
        private String notes;
        private Boolean isActive = true;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecurringResponse {
        private Long id;
        private Long categoryId;
        private String categoryName;
        private String categoryColor;
        private String categoryIcon;
        private Long subcategoryId;
        private String subcategoryName;
        private BigDecimal amount;
        private String currency;
        private String frequency;
        private LocalDate nextDueDate;
        private String paymentMethod;
        private String notes;
        private Boolean isActive;
    }
}
