package com.ecommerce.events;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderCompletedEvent(
    String orderId,
    String userId,
    Long productId,
    Integer quantity,
    BigDecimal amount,
    String status,
    Instant occurredAt
) {}
