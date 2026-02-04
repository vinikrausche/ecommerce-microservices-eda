package com.servico.ecommerce.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.servico.ecommerce.entities.Cart;
import com.servico.ecommerce.repository.CartsRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class CartService {
    private final CartsRepository repo;

    CartService(CartsRepository repo) {
        this.repo = repo;
    }

    public Cart create(Cart data) {
        return repo.save(data);
    }

    public List<Cart> getAll() {
        return repo.findAll();
    }

    public Cart findById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Cart not found"));
    }

    @Transactional
    public Cart addItems(Long cartId, List<Long> productIds) {
        Cart currentCart = repo.findById(cartId)
            .orElseThrow(() -> new EntityNotFoundException("Cart not found"));

        List<Long> currentItems = currentCart.getCartItems();
        if (currentItems == null) {
            currentItems = new ArrayList<>();
            currentCart.setCartItems(currentItems);
        }

        if (productIds != null && !productIds.isEmpty()) {
            currentItems.addAll(productIds);
        }

        return currentCart;
    }
}
