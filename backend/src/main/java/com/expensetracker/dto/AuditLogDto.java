package com.expensetracker.dto;

import lombok.*;
import java.time.LocalDateTime;

public class AuditLogDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LogResponse {
        private Long id;
        private Long expenseId;
        private String actionType; // CREATE, UPDATE, DELETE, BULK_DELETE, BULK_RECATEGORIZE, IMPORT
        private String details;
        private LocalDateTime timestamp;
    }
}
