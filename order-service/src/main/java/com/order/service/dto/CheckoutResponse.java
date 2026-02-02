package com.order.service.dto;

public record CheckoutResponse(
    String orderId,
    String status
) {}
