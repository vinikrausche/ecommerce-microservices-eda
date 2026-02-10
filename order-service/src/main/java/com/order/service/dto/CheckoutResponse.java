package com.order.service.dto;

public record CheckoutResponse(
    Long orderId,
    String status,
    String paymentLink
) {}
