package com.servico.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servico.ecommerce.entities.Cart;

public interface CartsRepository extends JpaRepository<Cart, Long> {

}
