package com.payment.service.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;

public record CreateBillRequest(
    @NotNull Long userId,
    @NotNull PaymentMethod billingType,
    @NotNull BigDecimal value,
    String description
) {
    public enum PaymentMethod {
        PIX,
        CREDIT_CARD,
        DEBIT_CARD
    }
}
