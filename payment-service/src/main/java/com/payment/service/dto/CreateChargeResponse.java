package com.payment.service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateChargeResponse(
        String object,
        String id,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate dateCreated,
        String customer,
        String subscription,
        String installment,
        String checkoutSession,
        String paymentLink,
        BigDecimal value,
        BigDecimal netValue,
        BigDecimal originalValue,
        BigDecimal interestValue,
        String description,
        String billingType,
        CreditCard creditCard,
        Boolean canBePaidAfterDueDate,
        String pixTransaction,
        String pixQrCodeId,
        String status,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate dueDate,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate originalDueDate,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate paymentDate,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate clientPaymentDate,
        Integer installmentNumber,
        String invoiceUrl,
        String invoiceNumber,
        String externalReference,
        Boolean deleted,
        Boolean anticipated,
        Boolean anticipable,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate creditDate,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate estimatedCreditDate,
        String transactionReceiptUrl,
        String nossoNumero,
        String bankSlipUrl,
        Discount discount,
        Fine fine,
        Interest interest,
        List<Split> split,
        Boolean postalService,
        Integer daysAfterDueDateToRegistrationCancellation,
        Chargeback chargeback,
        Escrow escrow,
        List<Refund> refunds
) {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record CreditCard(
            String creditCardNumber,
            String creditCardBrand,
            String creditCardToken
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Discount(
            BigDecimal value,
            Integer dueDateLimitDays,
            String type
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Fine(
            BigDecimal value
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Interest(
            BigDecimal value
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Split(
            String id,
            String walletId,
            BigDecimal fixedValue,
            BigDecimal percentualValue,
            BigDecimal totalValue,
            String cancellationReason,
            String status,
            String externalReference,
            String description
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Chargeback(
            String id,
            String payment,
            String installment,
            String customerAccount,
            String status,
            String reason,
            @JsonFormat(pattern = "yyyy-MM-dd")
            LocalDate disputeStartDate,
            BigDecimal value,
            @JsonFormat(pattern = "yyyy-MM-dd")
            LocalDate paymentDate,
            ChargebackCreditCard creditCard,
            String disputeStatus,
            @JsonFormat(pattern = "yyyy-MM-dd")
            LocalDate deadlineToSendDisputeDocuments
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ChargebackCreditCard(
            String number,
            String brand
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Escrow(
            String id,
            String status,
            @JsonFormat(pattern = "yyyy-MM-dd")
            LocalDate expirationDate,
            @JsonFormat(pattern = "yyyy-MM-dd")
            LocalDate finishDate,
            String finishReason
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Refund(
            @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
            LocalDateTime dateCreated,
            String status,
            BigDecimal value,
            String endToEndIdentifier,
            String description,
            @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
            LocalDateTime effectiveDate,
            String transactionReceiptUrl,
            List<RefundedSplit> refundedSplits
    ) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record RefundedSplit(
            String id,
            BigDecimal value,
            Boolean done
    ) {}
}
