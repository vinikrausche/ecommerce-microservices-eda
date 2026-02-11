package com.payment.service.dto;

public record PixQrCodeResponse(
    String encodedImage,
    String payload,
    String expirationDate,
    String description
) {}
