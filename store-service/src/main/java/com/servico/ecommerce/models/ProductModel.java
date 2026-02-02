package com.servico.ecommerce.models;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductModel {

    private Long id;
    private String titulo;
    private String descricao;
    private List<String> fotos;
    private BigDecimal preco;
    private Integer quantidade;
}
