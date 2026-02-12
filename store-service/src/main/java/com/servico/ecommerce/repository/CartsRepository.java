package com.servico.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servico.ecommerce.entities.Cart;
import com.servico.ecommerce.enums.CartStatus;

public interface CartsRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findTopByUserIdAndStatusOrderByIdDesc(Long userId, CartStatus status);
}
