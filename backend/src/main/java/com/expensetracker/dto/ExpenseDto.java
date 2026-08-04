package com.expensetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ExpenseDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExpenseRequest {
        @NotNull(message = "Category is required")
        private Long categoryId;

        private Long subcategoryId;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        private BigDecimal amount;

        private String currency = "USD";

        @NotNull(message = "Expense date is required")
        private LocalDate expenseDate;

        @NotNull(message = "Payment method is required")
        private String paymentMethod; // CASH, CARD, UPI, WALLET, BANK_TRANSFER

        private String notes;
        private String receiptUrl;
        private Boolean isRecurring = false;
        private String recurrenceRule;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExpenseResponse {
        private Long id;
        private Long categoryId;
        private String categoryName;
        private String categoryColor;
        private String categoryIcon;
        private Long subcategoryId;
        private String subcategoryName;
        private BigDecimal amount;
        private String currency;
        private LocalDate expenseDate;
        private String paymentMethod;
        private String notes;
        private String receiptUrl;
        private Boolean isRecurring;
        private String recurrenceRule;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BulkDeleteRequest {
        @NotNull(message = "IDs list cannot be null")
        private List<Long> ids;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BulkRecategorizeRequest {
        @NotNull(message = "IDs list cannot be null")
        private List<Long> ids;

        @NotNull(message = "New category ID is required")
        private Long newCategoryId;
    }
}
