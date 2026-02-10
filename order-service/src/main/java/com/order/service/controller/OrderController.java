package com.order.service.controller;

import java.time.Instant;

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
import com.order.service.dto.CreateBillRequest;
import com.order.service.dto.CreateBillResponse;
import com.order.service.entities.Order;
import com.order.service.client.PaymentClient;
import com.order.service.services.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Validated
public class OrderController {

    private final KafkaTemplate<String, PaymentRequestedEvent> kafkaTemplate;
    private final OrderService orderService;
    private final PaymentClient paymentClient;

    @Value("${app.kafka.topics.payment-requested}")
    private String paymentRequestedTopic;

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        CreateBillResponse bill = paymentClient.createBill(new CreateBillRequest(
            request.userId(),
            request.paymentMethod(),
            request.amount(),
            "Pedido do usuario " + request.userId()
        ));

        Order order = orderService.createOrder(request.userId(), request.productIds(), request.amount());

        PaymentRequestedEvent event = new PaymentRequestedEvent(
            order.getId(),
            request.userId(),
            request.productIds(),
            request.amount(),
            request.paymentMethod().name(),
            Instant.now()
        );

        kafkaTemplate.send(paymentRequestedTopic, String.valueOf(order.getId()), event);
        return ResponseEntity.accepted().body(new CheckoutResponse(
            order.getId(),
            order.getStatus().name(),
            bill.invoiceUrl()
        ));
    }
}
