package com.order.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.order.service.entities.Order;

public interface OrdersRepository extends JpaRepository<Order, Long> {

}
