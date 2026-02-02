package com.users.service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.users.service.dto.LoginRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/login")
public class LoginController {

    @PostMapping("")
    public ResponseEntity<Void> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok().build();
    }
}
