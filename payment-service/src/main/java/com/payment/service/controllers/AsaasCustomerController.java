package com.payment.service.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.payment.service.entities.AsaasCustomer;
import com.payment.service.services.AsaasCustomerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/asaas-customers")
@RequiredArgsConstructor
public class AsaasCustomerController {

    private final AsaasCustomerService service;

    @GetMapping
    public ResponseEntity<List<AsaasCustomer>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }
}
