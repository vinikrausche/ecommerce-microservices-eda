package com.ecommerce.events;

import java.math.BigDecimal;
import java.time.Instant;

public record PaymentRequestedEvent(
    String orderId,
    String userId,
    Long productId,
    Integer quantity,
    BigDecimal amount,
    Instant occurredAt
) {}
