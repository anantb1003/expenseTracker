package com.expensetracker.repository;

import com.expensetracker.model.ExpenseAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseAuditLogRepository extends JpaRepository<ExpenseAuditLog, Long> {
    Page<ExpenseAuditLog> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);
    List<ExpenseAuditLog> findTop20ByUserIdOrderByTimestampDesc(Long userId);
}
