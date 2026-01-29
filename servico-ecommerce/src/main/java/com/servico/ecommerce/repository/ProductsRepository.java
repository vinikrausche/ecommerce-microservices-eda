package com.servico.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servico.ecommerce.entities.Product;

public interface ProductsRepository extends JpaRepository<Product, Long> {
    
}
