package com.expensetracker.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashTest {

    @Test
    void printPasswordHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("password123");
        System.out.println("BCRYPT_HASH_FOR_PASSWORD123: " + hash);
        org.junit.jupiter.api.Assertions.assertTrue(encoder.matches("password123", hash));
    }
}
