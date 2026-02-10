package com.ecommerce.events;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderCompletedEvent(
    Long orderId,
    Long userId,
    List<Long> productIds,
    BigDecimal amount,
    String status,
    Instant occurredAt
) {}
