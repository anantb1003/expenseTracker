package com.expensetracker.repository;

import com.expensetracker.model.RecurringExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecurringExpenseRepository extends JpaRepository<RecurringExpense, Long> {

    List<RecurringExpense> findByUserIdOrderByNextDueDateAsc(Long userId);

    List<RecurringExpense> findByIsActiveTrueAndNextDueDateLessThanEqual(LocalDate date);

    Optional<RecurringExpense> findByIdAndUserId(Long id, Long userId);
}
