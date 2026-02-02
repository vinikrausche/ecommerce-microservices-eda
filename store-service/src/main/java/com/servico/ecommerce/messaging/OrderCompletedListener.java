package com.servico.ecommerce.messaging;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.ecommerce.events.OrderCompletedEvent;
import com.servico.ecommerce.services.ProductService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderCompletedListener {

    private final ProductService productService;

    @KafkaListener(topics = "${app.kafka.topics.order-completed}")
    public void handle(OrderCompletedEvent event) {
        log.info("Order completed received for order {}", event.orderId());

        if (event.productId() == null || event.quantity() == null) {
            log.warn("Missing product data for order {}", event.orderId());
            return;
        }

        try {
            productService.decreaseQuantity(event.productId(), event.quantity());
            log.info("Inventory updated for product {}", event.productId());
        } catch (EntityNotFoundException ex) {
            log.warn("Product {} not found for order {}", event.productId(), event.orderId());
        }
    }
}
