package com.expensetracker.controller;

import com.expensetracker.dto.AuthDto;
import com.expensetracker.security.UserPrincipal;
import com.expensetracker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    @Autowired
    private AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<AuthDto.UserProfile> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(authService.getCurrentUserProfile(currentUser.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthDto.UserProfile> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody AuthDto.UserProfile request
    ) {
        return ResponseEntity.ok(authService.updateProfile(currentUser.getId(), request));
    }
}
