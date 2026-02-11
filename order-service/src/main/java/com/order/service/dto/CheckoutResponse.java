package com.order.service.dto;

public record CheckoutResponse(
    Long orderId,
    String status,
    String paymentLink,
    String invoiceUrl,
    String pixQrCodeImage,
    String pixCopyPaste
) {}
