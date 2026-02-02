package com.order.service.controller;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.events.PaymentRequestedEvent;
import com.order.service.dto.CheckoutRequest;
import com.order.service.dto.CheckoutResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Validated
public class OrderController {

    private final KafkaTemplate<String, PaymentRequestedEvent> kafkaTemplate;

    @Value("${app.kafka.topics.payment-requested}")
    private String paymentRequestedTopic;

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        String orderId = UUID.randomUUID().toString();
        BigDecimal amount = request.amount();

        PaymentRequestedEvent event = new PaymentRequestedEvent(
            orderId,
            request.userId(),
            request.productId(),
            request.quantity(),
            amount,
            Instant.now()
        );

        kafkaTemplate.send(paymentRequestedTopic, orderId, event);
        return ResponseEntity.accepted().body(new CheckoutResponse(orderId, "PAYMENT_REQUESTED"));
    }
}
