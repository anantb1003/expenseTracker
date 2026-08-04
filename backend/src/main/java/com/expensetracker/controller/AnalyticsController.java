package com.expensetracker.controller;

import com.expensetracker.dto.AnalyticsDto;
import com.expensetracker.security.UserPrincipal;
import com.expensetracker.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsDto.DashboardSummary> getDashboardSummary(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(analyticsService.getDashboardSummary(currentUser.getId()));
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<List<AnalyticsDto.CategorySpendBreakdown>> getCategoryBreakdown(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown(currentUser.getId(), startDate, endDate));
    }

    @GetMapping("/monthly-trend")
    public ResponseEntity<List<AnalyticsDto.MonthlySpendTrend>> getMonthlyTrend(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "6") int months
    ) {
        return ResponseEntity.ok(analyticsService.getMonthlySpendTrend(currentUser.getId(), months));
    }

    @GetMapping("/daily-trend")
    public ResponseEntity<List<AnalyticsDto.DailySpendTrend>> getDailyTrend(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        return ResponseEntity.ok(analyticsService.getDailySpendTrend(currentUser.getId(), year, month));
    }
}
