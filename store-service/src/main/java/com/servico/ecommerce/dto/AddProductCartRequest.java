package com.servico.ecommerce.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.servico.ecommerce.enums.CartStatus;

@JsonInclude(JsonInclude.Include.NON_NULL) 
public record AddProductCartRequest(
    Long id, //optional
    List<Long> cart_items, 
    Long user_id,
    CartStatus status
    ) {}
