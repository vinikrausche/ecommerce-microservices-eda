package com.ecommerce.events;

import java.math.BigDecimal;
import java.time.Instant;

public record PaymentApprovedEvent(
    String orderId,
    String userId,
    Long productId,
    Integer quantity,
    BigDecimal amount,
    boolean approved,
    Instant occurredAt
) {}
