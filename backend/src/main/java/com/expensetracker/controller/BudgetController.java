package com.expensetracker.controller;

import com.expensetracker.dto.BudgetDto;
import com.expensetracker.security.UserPrincipal;
import com.expensetracker.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<BudgetDto.BudgetResponse>> getBudgets(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        if (month == null) month = LocalDate.now().getMonthValue();
        if (year == null) year = LocalDate.now().getYear();

        return ResponseEntity.ok(budgetService.getBudgetsForMonth(currentUser.getId(), month, year));
    }

    @PostMapping
    public ResponseEntity<BudgetDto.BudgetResponse> setBudget(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody BudgetDto.BudgetRequest request
    ) {
        return ResponseEntity.ok(budgetService.setBudget(currentUser.getId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id
    ) {
        budgetService.deleteBudget(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
