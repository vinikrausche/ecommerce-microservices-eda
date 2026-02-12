package com.payment.service.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AsaasWebhookRequest(
    String event,
    Payment payment
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Payment(
        String id,
        String status,
        BigDecimal value
    ) {}
}
