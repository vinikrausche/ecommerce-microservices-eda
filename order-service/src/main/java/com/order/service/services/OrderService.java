package com.order.service.services;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.order.service.entities.Order;
import com.order.service.enums.OrderStatus;
import com.order.service.repository.OrdersRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class OrderService {

    private final OrdersRepository repo;

    OrderService(OrdersRepository repo) {
        this.repo = repo;
    }

    public Order createOrder(Long userId, List<Long> productIds, BigDecimal totalPrice) {
        Order order = Order.builder()
            .userId(userId)
            .productIds(productIds)
            .totalPrice(totalPrice)
            .createdAt(Instant.now())
            .status(OrderStatus.PAYMENT_REQUESTED)
            .build();

        return repo.save(order);
    }

    public Order findById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Order not found"));
    }

    @Transactional
    public Order updateStatus(Long id, OrderStatus status) {
        Order order = repo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        order.setStatus(status);
        return order;
    }
}
