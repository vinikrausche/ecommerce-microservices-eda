package com.order.service.dto;

import java.math.BigDecimal;
import java.util.List;

import com.order.service.enums.PaymentMethod;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CheckoutRequest(
    @NotNull Long userId,
    @NotEmpty List<Long> productIds,
    @NotNull @DecimalMin("0.01") BigDecimal amount,
    @NotNull PaymentMethod paymentMethod
) {}
