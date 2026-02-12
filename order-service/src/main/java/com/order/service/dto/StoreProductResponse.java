package com.order.service.dto;

import java.math.BigDecimal;

public record StoreProductResponse(
    Long id,
    BigDecimal preco,
    Integer quantidade
) {}
