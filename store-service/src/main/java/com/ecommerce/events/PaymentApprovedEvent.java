package com.ecommerce.events;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PaymentApprovedEvent(
    Long orderId,
    Long userId,
    List<Long> productIds,
    BigDecimal amount,
    String paymentId,
    boolean approved,
    Instant occurredAt
) {}
