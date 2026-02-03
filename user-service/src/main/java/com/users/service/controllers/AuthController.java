package com.users.service.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.users.service.dto.LoginRequest;
import com.users.service.dto.UserResponse;
import com.users.service.entities.User;
import com.users.service.services.AuthService;
import com.users.service.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/login")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    AuthController(AuthService authService,UserService userService) {
        this.authService = authService;
        this.userService = userService;

    }

    @PostMapping("")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {

       UserResponse user =  this.userService.getByEmail(request.email());

       if(user.password().equals(request.password())) {
           String token = this.authService.generateToken(user.email());
           return ResponseEntity.ok(token);
       }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
