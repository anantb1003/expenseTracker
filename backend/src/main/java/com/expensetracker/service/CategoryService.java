package com.expensetracker.service;

import com.expensetracker.dto.CategoryDto;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Category;
import com.expensetracker.model.Subcategory;
import com.expensetracker.model.User;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.SubcategoryRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CategoryDto.CategoryResponse> getCategoriesForUser(Long userId) {
        List<Category> categories = categoryRepository.findAllAvailableForUser(userId);
        return categories.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto.CategoryResponse createCategory(Long userId, CategoryDto.CategoryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = Category.builder()
                .user(user)
                .name(request.getName())
                .icon(request.getIcon() != null ? request.getIcon() : "Tag")
                .color(request.getColor() != null ? request.getColor() : "#4F46E5")
                .isDefault(false)
                .subcategories(new ArrayList<>())
                .build();

        if (request.getSubcategories() != null) {
            for (String subName : request.getSubcategories()) {
                if (!subName.isBlank()) {
                    category.getSubcategories().add(Subcategory.builder()
                            .category(category)
                            .name(subName.trim())
                            .build());
                }
            }
        }

        Category saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    @Transactional
    public CategoryDto.CategoryResponse updateCategory(Long userId, Long categoryId, CategoryDto.CategoryRequest request) {
        Category category = categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found or not owned by user"));

        if (Boolean.TRUE.equals(category.getIsDefault())) {
            throw new BadRequestException("Default system categories cannot be modified");
        }

        category.setName(request.getName());
        if (request.getIcon() != null) category.setIcon(request.getIcon());
        if (request.getColor() != null) category.setColor(request.getColor());

        if (request.getSubcategories() != null) {
            category.getSubcategories().clear();
            for (String subName : request.getSubcategories()) {
                if (!subName.isBlank()) {
                    category.getSubcategories().add(Subcategory.builder()
                            .category(category)
                            .name(subName.trim())
                            .build());
                }
            }
        }

        Category updated = categoryRepository.save(category);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteCategory(Long userId, Long categoryId) {
        Category category = categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found or not owned by user"));

        if (Boolean.TRUE.equals(category.getIsDefault())) {
            throw new BadRequestException("Default system categories cannot be deleted");
        }

        categoryRepository.delete(category);
    }

    private CategoryDto.CategoryResponse mapToResponse(Category category) {
        List<CategoryDto.SubcategoryResponse> subDtos = category.getSubcategories() != null ?
                category.getSubcategories().stream().map(s -> CategoryDto.SubcategoryResponse.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .build()).collect(Collectors.toList()) : List.of();

        return CategoryDto.CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .icon(category.getIcon())
                .color(category.getColor())
                .isDefault(category.getIsDefault())
                .subcategories(subDtos)
                .build();
    }
}
