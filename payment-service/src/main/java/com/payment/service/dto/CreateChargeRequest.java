package com.payment.service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL) /*
!DO NOT SEND NULL FIELDS */
public record CreateChargeRequest(
        String customer,
        BillingType billingType,
        BigDecimal value,

        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate dueDate,

        String description,
        String externalReference,

        // optional
        Discount discount,
        Fine fine,
        Interest interest,
        List<Split> split
) {

    public enum BillingType {
        BOLETO,
        PIX,
        CREDIT_CARD
    }

    public record Discount(
            DiscountType type,
            BigDecimal value,   // can be percentage or fixed
            Integer days        // ex.: 30
    ) {
        public enum DiscountType { FIXED, PERCENTAGE }
    }

    public record Fine(
            BigDecimal value // porcentage/penalties
    ) {}

    public record Interest(
            BigDecimal value // usally porcentage/interest rates
    ) {}

    public record Split(
            String walletId,
            BigDecimal fixedValue,
            BigDecimal percentualValue
    ) {}
}
