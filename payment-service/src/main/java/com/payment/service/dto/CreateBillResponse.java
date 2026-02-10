package com.payment.service.dto;

import java.time.LocalDate;

public record CreateBillResponse(
    String id,
    String customerId,
    LocalDate dateCreated,
    String invoiceUrl
) {}
