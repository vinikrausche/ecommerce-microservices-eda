package com.order.service.dto;

import java.math.BigDecimal;

import com.order.service.enums.PaymentMethod;

import jakarta.validation.constraints.NotNull;

public record CreateBillRequest(
    @NotNull Long userId,
    @NotNull PaymentMethod billingType,
    @NotNull BigDecimal value,
    String description
) {}
