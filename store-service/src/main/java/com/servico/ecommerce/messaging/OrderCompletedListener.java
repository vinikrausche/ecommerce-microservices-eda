package com.servico.ecommerce.messaging;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.ecommerce.events.OrderCompletedEvent;
import com.servico.ecommerce.services.ProductService;

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

        if (event.productIds() == null || event.productIds().isEmpty()) {
            log.warn("Missing product data for order {}", event.orderId());
            return;
        }

        event.productIds().stream()
            .filter(productId -> productId != null)
            .collect(java.util.stream.Collectors.groupingBy(productId -> productId, java.util.stream.Collectors.counting()))
            .forEach((productId, count) -> {
                try {
                    productService.decreaseQuantity(productId, Math.toIntExact(count));
                    log.info("Inventory updated for product {}", productId);
                } catch (jakarta.persistence.EntityNotFoundException ex) {
                    log.warn("Product {} not found for order {}", productId, event.orderId());
                }
            });
    }
}
