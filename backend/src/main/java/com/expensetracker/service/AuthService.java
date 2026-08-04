package com.expensetracker.service;

import com.expensetracker.dto.AuthDto;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JwtTokenProvider;
import com.expensetracker.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AuthDto.UserProfile profile = AuthDto.UserProfile.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .currency(user.getCurrency())
                .build();

        return AuthDto.LoginResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .user(profile)
                .build();
    }

    @Transactional
    public AuthDto.LoginResponse register(AuthDto.SignUpRequest request) {
        Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());
        User user;

        if (existingUserOpt.isPresent()) {
            // Update password & name for existing user and log in seamlessly
            user = existingUserOpt.get();
            if (request.getName() != null && !request.getName().isBlank()) {
                user.setName(request.getName());
            }
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR");
        } else {
            // Create new user account
            user = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                    .build();
        }

        User savedUser = userRepository.save(user);

        String token = tokenProvider.generateTokenFromUserId(savedUser.getId(), savedUser.getEmail());

        AuthDto.UserProfile profile = AuthDto.UserProfile.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .currency(savedUser.getCurrency())
                .build();

        return AuthDto.LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(profile)
                .build();
    }

    public AuthDto.UserProfile getCurrentUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return AuthDto.UserProfile.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .currency(user.getCurrency())
                .build();
    }

    @Transactional
    public AuthDto.UserProfile updateProfile(Long userId, AuthDto.UserProfile request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        User saved = userRepository.save(user);
        return AuthDto.UserProfile.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .currency(saved.getCurrency())
                .build();
    }

    @Transactional
    public void forgotPassword(AuthDto.ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));
    }
}
