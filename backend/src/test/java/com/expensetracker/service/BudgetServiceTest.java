package com.expensetracker.service;

import com.expensetracker.dto.BudgetDto;
import com.expensetracker.model.Budget;
import com.expensetracker.model.Category;
import com.expensetracker.model.User;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BudgetService budgetService;

    private User testUser;
    private Category testCategory;
    private Budget testBudget;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).name("Test User").email("test@example.com").build();
        testCategory = Category.builder().id(1L).name("Transport").color("#3B82F6").icon("Car").build();
        testBudget = Budget.builder()
                .id(10L)
                .user(testUser)
                .category(testCategory)
                .month(8)
                .year(2026)
                .amount(new BigDecimal("200.00"))
                .build();
    }

    @Test
    void testSetBudget_Success() {
        BudgetDto.BudgetRequest request = new BudgetDto.BudgetRequest();
        request.setCategoryId(1L);
        request.setMonth(8);
        request.setYear(2026);
        request.setAmount(new BigDecimal("200.00"));

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(1L, 1L, 8, 2026)).thenReturn(Optional.empty());
        when(budgetRepository.save(any(Budget.class))).thenReturn(testBudget);
        when(expenseRepository.sumByCategoryAndDateBetween(eq(1L), eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(new BigDecimal("170.00")); // 85% spent -> WARNING_80

        BudgetDto.BudgetResponse response = budgetService.setBudget(1L, request);

        assertNotNull(response);
        assertEquals(new BigDecimal("200.00"), response.getBudgetAmount());
        assertEquals(new BigDecimal("170.00"), response.getSpentAmount());
        assertEquals("WARNING_80", response.getAlertStatus());
    }
}
