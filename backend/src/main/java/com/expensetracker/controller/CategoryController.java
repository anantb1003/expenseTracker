package com.expensetracker.controller;

import com.expensetracker.dto.CategoryDto;
import com.expensetracker.security.UserPrincipal;
import com.expensetracker.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto.CategoryResponse>> getCategories(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(categoryService.getCategoriesForUser(currentUser.getId()));
    }

    @PostMapping
    public ResponseEntity<CategoryDto.CategoryResponse> createCategory(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CategoryDto.CategoryRequest request
    ) {
        return new ResponseEntity<>(categoryService.createCategory(currentUser.getId(), request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto.CategoryResponse> updateCategory(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody CategoryDto.CategoryRequest request
    ) {
        return ResponseEntity.ok(categoryService.updateCategory(currentUser.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id
    ) {
        categoryService.deleteCategory(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
