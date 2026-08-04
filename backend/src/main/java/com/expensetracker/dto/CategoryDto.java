package com.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

public class CategoryDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryRequest {
        @NotBlank(message = "Category name is required")
        private String name;
        private String icon = "Tag";
        private String color = "#4F46E5";
        private List<String> subcategories;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryResponse {
        private Long id;
        private String name;
        private String icon;
        private String color;
        private Boolean isDefault;
        private List<SubcategoryResponse> subcategories;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubcategoryResponse {
        private Long id;
        private String name;
    }
}
