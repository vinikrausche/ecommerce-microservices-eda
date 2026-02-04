package com.servico.ecommerce.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AddProductCartResponse(Long id, List<Long> cart_items){}
