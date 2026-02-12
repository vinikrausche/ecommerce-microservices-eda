package com.payment.service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.payment.service.dto.AsaasWebhookRequest;
import com.payment.service.services.BillService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentWebhookController {

    private final BillService billService;

    @PostMapping("/webhook")
    public ResponseEntity<Void> handle(@RequestBody AsaasWebhookRequest request) {
        billService.processWebhook(request);
        return ResponseEntity.ok().build();
    }
}
