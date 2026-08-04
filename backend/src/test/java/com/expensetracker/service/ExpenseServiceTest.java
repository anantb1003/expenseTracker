package com.expensetracker.service;

import com.expensetracker.dto.ExpenseDto;
import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.SubcategoryRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private SubcategoryRepository subcategoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private User testUser;
    private Category testCategory;
    private Expense testExpense;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).name("Test User").email("test@example.com").currency("USD").build();
        testCategory = Category.builder().id(1L).name("Food").color("#EF4444").icon("Utensils").build();
        testExpense = Expense.builder()
                .id(100L)
                .user(testUser)
                .category(testCategory)
                .amount(new BigDecimal("50.00"))
                .currency("USD")
                .expenseDate(LocalDate.now())
                .paymentMethod("CARD")
                .notes("Lunch")
                .isRecurring(false)
                .build();
    }

    @Test
    void testCreateExpense_Success() {
        ExpenseDto.ExpenseRequest request = new ExpenseDto.ExpenseRequest();
        request.setCategoryId(1L);
        request.setAmount(new BigDecimal("50.00"));
        request.setExpenseDate(LocalDate.now());
        request.setPaymentMethod("CARD");
        request.setNotes("Lunch");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(expenseRepository.save(any(Expense.class))).thenReturn(testExpense);

        ExpenseDto.ExpenseResponse response = expenseService.createExpense(1L, request);

        assertNotNull(response);
        assertEquals(new BigDecimal("50.00"), response.getAmount());
        assertEquals("Food", response.getCategoryName());
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    void testGetExpenseById_Success() {
        when(expenseRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(testExpense));

        ExpenseDto.ExpenseResponse response = expenseService.getExpenseById(1L, 100L);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("Lunch", response.getNotes());
    }

    @Test
    void testDeleteExpense_Success() {
        when(expenseRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(testExpense));

        expenseService.deleteExpense(1L, 100L);

        verify(expenseRepository, times(1)).delete(testExpense);
    }
}
