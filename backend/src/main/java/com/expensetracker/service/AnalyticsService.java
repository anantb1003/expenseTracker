package com.expensetracker.service;

import com.expensetracker.dto.AnalyticsDto;
import com.expensetracker.dto.BudgetDto;
import com.expensetracker.model.Budget;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private BudgetService budgetService;

    public AnalyticsDto.DashboardSummary getDashboardSummary(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate startOfMonth = today.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());

        BigDecimal spentToday = expenseRepository.sumTotalByUserIdAndDate(userId, today);
        BigDecimal spentThisWeek = expenseRepository.sumTotalByUserIdAndDateBetween(userId, startOfWeek, today);
        BigDecimal spentThisMonth = expenseRepository.sumTotalByUserIdAndDateBetween(userId, startOfMonth, endOfMonth);

        if (spentToday == null) spentToday = BigDecimal.ZERO;
        if (spentThisWeek == null) spentThisWeek = BigDecimal.ZERO;
        if (spentThisMonth == null) spentThisMonth = BigDecimal.ZERO;

        // Top Spending Category this month
        List<Object[]> categorySummaries = expenseRepository.findCategorySpendSummary(userId, startOfMonth, endOfMonth);
        String topCategoryName = "None";
        BigDecimal topCategoryAmount = BigDecimal.ZERO;

        if (!categorySummaries.isEmpty()) {
            Object[] top = categorySummaries.get(0);
            topCategoryName = (String) top[1];
            topCategoryAmount = (BigDecimal) top[4];
        }

        // Monthly Budget
        Optional<Budget> overallBudgetOpt = budgetRepository.findByUserIdAndCategoryIsNullAndMonthAndYear(
                userId, today.getMonthValue(), today.getYear());

        BigDecimal monthlyBudgetAmount = overallBudgetOpt.map(Budget::getAmount).orElse(BigDecimal.ZERO);
        Double budgetPercentage = monthlyBudgetAmount.compareTo(BigDecimal.ZERO) > 0 ?
                spentThisMonth.multiply(new BigDecimal(100)).divide(monthlyBudgetAmount, 2, RoundingMode.HALF_UP).doubleValue() : 0.0;

        List<BudgetDto.BudgetResponse> budgetAlerts = budgetService.getBudgetAlerts(userId, today.getMonthValue(), today.getYear());

        return AnalyticsDto.DashboardSummary.builder()
                .spentToday(spentToday)
                .spentThisWeek(spentThisWeek)
                .spentThisMonth(spentThisMonth)
                .topCategoryName(topCategoryName)
                .topCategoryAmount(topCategoryAmount)
                .monthlyBudgetAmount(monthlyBudgetAmount)
                .monthlyBudgetSpent(spentThisMonth)
                .monthlyBudgetPercentage(budgetPercentage)
                .budgetAlerts(budgetAlerts)
                .build();
    }

    public List<AnalyticsDto.CategorySpendBreakdown> getCategoryBreakdown(Long userId, LocalDate startDate, LocalDate endDate) {
        if (startDate == null) startDate = LocalDate.now().with(TemporalAdjusters.firstDayOfMonth());
        if (endDate == null) endDate = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth());

        List<Object[]> rawList = expenseRepository.findCategorySpendSummary(userId, startDate, endDate);
        BigDecimal totalSpent = rawList.stream()
                .map(row -> (BigDecimal) row[4])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return rawList.stream().map(row -> {
            Long categoryId = (Long) row[0];
            String name = (String) row[1];
            String color = (String) row[2];
            String icon = (String) row[3];
            BigDecimal amount = (BigDecimal) row[4];

            double percentage = totalSpent.compareTo(BigDecimal.ZERO) > 0 ?
                    amount.multiply(new BigDecimal(100)).divide(totalSpent, 2, RoundingMode.HALF_UP).doubleValue() : 0.0;

            return AnalyticsDto.CategorySpendBreakdown.builder()
                    .categoryId(categoryId)
                    .categoryName(name)
                    .categoryColor(color)
                    .categoryIcon(icon)
                    .amount(amount)
                    .percentage(percentage)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<AnalyticsDto.MonthlySpendTrend> getMonthlySpendTrend(Long userId, int monthsCount) {
        List<AnalyticsDto.MonthlySpendTrend> result = new ArrayList<>();
        YearMonth currentYearMonth = YearMonth.now();

        for (int i = monthsCount - 1; i >= 0; i--) {
            YearMonth targetMonth = currentYearMonth.minusMonths(i);
            LocalDate start = targetMonth.atDay(1);
            LocalDate end = targetMonth.atEndOfMonth();

            BigDecimal total = expenseRepository.sumTotalByUserIdAndDateBetween(userId, start, end);
            if (total == null) total = BigDecimal.ZERO;

            String label = targetMonth.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + targetMonth.getYear();

            result.add(AnalyticsDto.MonthlySpendTrend.builder()
                    .monthLabel(label)
                    .year(targetMonth.getYear())
                    .month(targetMonth.getMonthValue())
                    .totalAmount(total)
                    .build());
        }

        return result;
    }

    public List<AnalyticsDto.DailySpendTrend> getDailySpendTrend(Long userId, Integer year, Integer month) {
        if (year == null) year = LocalDate.now().getYear();
        if (month == null) month = LocalDate.now().getMonthValue();

        YearMonth targetMonth = YearMonth.of(year, month);
        int daysInMonth = targetMonth.lengthOfMonth();

        List<AnalyticsDto.DailySpendTrend> result = new ArrayList<>();

        for (int day = 1; day <= daysInMonth; day++) {
            LocalDate date = targetMonth.atDay(day);
            BigDecimal total = expenseRepository.sumTotalByUserIdAndDate(userId, date);
            if (total == null) total = BigDecimal.ZERO;

            result.add(AnalyticsDto.DailySpendTrend.builder()
                    .date(date.toString())
                    .totalAmount(total)
                    .build());
        }

        return result;
    }
}
