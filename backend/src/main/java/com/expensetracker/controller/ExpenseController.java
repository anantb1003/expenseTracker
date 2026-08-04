package com.expensetracker.controller;

import com.expensetracker.dto.AuditLogDto;
import com.expensetracker.dto.ExpenseDto;
import com.expensetracker.security.UserPrincipal;
import com.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<Page<ExpenseDto.ExpenseResponse>> getExpenses(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "expenseDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Page<ExpenseDto.ExpenseResponse> expenses = expenseService.getExpenses(
                userPrincipal.getId(), startDate, endDate, categoryId, minAmount, maxAmount, search, paymentMethod, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDto.ExpenseResponse> getExpenseById(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id
    ) {
        ExpenseDto.ExpenseResponse expense = expenseService.getExpenseById(userPrincipal.getId(), id);
        return ResponseEntity.ok(expense);
    }

    @PostMapping
    public ResponseEntity<ExpenseDto.ExpenseResponse> createExpense(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ExpenseDto.ExpenseRequest request
    ) {
        ExpenseDto.ExpenseResponse created = expenseService.createExpense(userPrincipal.getId(), request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDto.ExpenseResponse> updateExpense(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody ExpenseDto.ExpenseRequest request
    ) {
        ExpenseDto.ExpenseResponse updated = expenseService.updateExpense(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteExpense(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id
    ) {
        expenseService.deleteExpense(userPrincipal.getId(), id);
        return ResponseEntity.ok(Map.of("message", "Expense deleted successfully"));
    }

    @PostMapping("/bulk-delete")
    public ResponseEntity<Map<String, String>> bulkDelete(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ExpenseDto.BulkDeleteRequest request
    ) {
        expenseService.bulkDeleteExpenses(userPrincipal.getId(), request.getIds());
        return ResponseEntity.ok(Map.of("message", "Bulk delete completed successfully"));
    }

    @PostMapping("/bulk-recategorize")
    public ResponseEntity<Map<String, String>> bulkRecategorize(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ExpenseDto.BulkRecategorizeRequest request
    ) {
        expenseService.bulkRecategorize(userPrincipal.getId(), request.getIds(), request.getNewCategoryId());
        return ResponseEntity.ok(Map.of("message", "Bulk re-categorize completed successfully"));
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importCsv(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("file") MultipartFile file
    ) {
        int count = expenseService.importCsv(userPrincipal.getId(), file);
        return ResponseEntity.ok(Map.of(
                "message", "CSV imported successfully",
                "importedCount", count
        ));
    }

    @GetMapping("/history")
    public ResponseEntity<Page<AuditLogDto.LogResponse>> getAuditHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<AuditLogDto.LogResponse> history = expenseService.getAuditHistory(userPrincipal.getId(), page, size);
        return ResponseEntity.ok(history);
    }
}
