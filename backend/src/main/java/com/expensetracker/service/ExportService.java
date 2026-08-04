package com.expensetracker.service;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExportService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public byte[] exportToCsv(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = getExpensesForExport(userId, startDate, endDate);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (CSVPrinter printer = new CSVPrinter(new PrintWriter(out), CSVFormat.DEFAULT.withHeader("ID", "Date", "Category", "Subcategory", "Amount", "Currency", "Payment Method", "Notes", "Recurring"))) {
            for (Expense e : expenses) {
                printer.printRecord(
                        e.getId(),
                        e.getExpenseDate(),
                        e.getCategory().getName(),
                        e.getSubcategory() != null ? e.getSubcategory().getName() : "",
                        e.getAmount(),
                        e.getCurrency(),
                        e.getPaymentMethod(),
                        e.getNotes() != null ? e.getNotes() : "",
                        e.getIsRecurring() != null && e.getIsRecurring() ? "Yes" : "No"
                );
            }
            printer.flush();
        } catch (Exception ex) {
            throw new RuntimeException("Error generating CSV export", ex);
        }
        return out.toByteArray();
    }

    public byte[] exportToExcel(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = getExpensesForExport(userId, startDate, endDate);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Expenses");

            // Header Row Styling
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.INDIGO.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);

            String[] headers = {"ID", "Date", "Category", "Subcategory", "Amount", "Currency", "Payment Method", "Notes"};
            org.apache.poi.ss.usermodel.Row headerRow = sheet.createRow(0);

            for (int i = 0; i < headers.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerCellStyle);
            }

            int rowIdx = 1;
            BigDecimal totalAmount = BigDecimal.ZERO;

            for (Expense e : expenses) {
                org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(e.getId());
                row.createCell(1).setCellValue(e.getExpenseDate().toString());
                row.createCell(2).setCellValue(e.getCategory().getName());
                row.createCell(3).setCellValue(e.getSubcategory() != null ? e.getSubcategory().getName() : "");
                row.createCell(4).setCellValue(e.getAmount().doubleValue());
                row.createCell(5).setCellValue(e.getCurrency());
                row.createCell(6).setCellValue(e.getPaymentMethod());
                row.createCell(7).setCellValue(e.getNotes() != null ? e.getNotes() : "");

                totalAmount = totalAmount.add(e.getAmount());
            }

            // Total Summary Row
            org.apache.poi.ss.usermodel.Row totalRow = sheet.createRow(rowIdx);
            org.apache.poi.ss.usermodel.Cell totalLabelCell = totalRow.createCell(3);
            totalLabelCell.setCellValue("TOTAL:");
            org.apache.poi.ss.usermodel.Cell totalValCell = totalRow.createCell(4);
            totalValCell.setCellValue(totalAmount.doubleValue());

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception ex) {
            throw new RuntimeException("Error generating Excel export", ex);
        }
    }

    public byte[] exportToPdf(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = getExpensesForExport(userId, startDate, endDate);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            // Title Header
            com.lowagie.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, java.awt.Color.BLACK);
            Paragraph title = new Paragraph("Daily Expense Report Summary", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(15);
            document.add(title);

            // Period Subtitle
            com.lowagie.text.Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 10, java.awt.Color.DARK_GRAY);
            Paragraph subtitle = new Paragraph("Period: " + startDate + " to " + endDate, subFont);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // Table setup
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1.5f, 3.0f, 2.5f, 2.0f, 2.0f, 4.0f});

            String[] tableHeaders = {"Date", "Category", "Subcategory", "Amount", "Method", "Notes"};
            com.lowagie.text.Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, java.awt.Color.WHITE);

            for (String header : tableHeaders) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setBackgroundColor(new java.awt.Color(79, 70, 229)); // Indigo
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(6);
                table.addCell(cell);
            }

            com.lowagie.text.Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 9, java.awt.Color.BLACK);
            BigDecimal grandTotal = BigDecimal.ZERO;

            for (Expense e : expenses) {
                table.addCell(new Phrase(e.getExpenseDate().toString(), cellFont));
                table.addCell(new Phrase(e.getCategory().getName(), cellFont));
                table.addCell(new Phrase(e.getSubcategory() != null ? e.getSubcategory().getName() : "-", cellFont));
                table.addCell(new Phrase("$" + e.getAmount().toString(), cellFont));
                table.addCell(new Phrase(e.getPaymentMethod(), cellFont));
                table.addCell(new Phrase(e.getNotes() != null ? e.getNotes() : "", cellFont));

                grandTotal = grandTotal.add(e.getAmount());
            }

            document.add(table);

            // Grand Total Footer Paragraph
            com.lowagie.text.Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, java.awt.Color.BLACK);
            Paragraph totalPara = new Paragraph("\nGrand Total Spent: $" + grandTotal.toString(), totalFont);
            totalPara.setAlignment(Element.ALIGN_RIGHT);
            document.add(totalPara);

            document.close();
            return out.toByteArray();
        } catch (Exception ex) {
            throw new RuntimeException("Error generating PDF export", ex);
        }
    }

    private List<Expense> getExpensesForExport(Long userId, LocalDate startDate, LocalDate endDate) {
        if (startDate == null) startDate = LocalDate.now().minusMonths(1);
        if (endDate == null) endDate = LocalDate.now();

        return expenseRepository.findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(userId, startDate, endDate);
    }
}
