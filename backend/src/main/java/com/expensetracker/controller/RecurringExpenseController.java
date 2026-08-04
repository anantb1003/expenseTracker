package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseDto;
import com.expensetracker.dto.RecurringDto;
import com.expensetracker.security.UserPrincipal;
import com.expensetracker.service.RecurringExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recurring")
public class RecurringExpenseController {

    @Autowired
    private RecurringExpenseService recurringExpenseService;

    @GetMapping
    public ResponseEntity<List<RecurringDto.RecurringResponse>> getRecurringExpenses(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(recurringExpenseService.getRecurringExpensesForUser(currentUser.getId()));
    }

    @PostMapping
    public ResponseEntity<RecurringDto.RecurringResponse> createRecurringExpense(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody RecurringDto.RecurringRequest request
    ) {
        return new ResponseEntity<>(recurringExpenseService.createRecurringExpense(currentUser.getId(), request), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecurringExpense(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id
    ) {
        recurringExpenseService.deleteRecurringExpense(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/trigger")
    public ResponseEntity<ExpenseDto.ExpenseResponse> triggerNow(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(recurringExpenseService.triggerDueRecurringExpense(currentUser.getId(), id));
    }
}
