package com.order.service.messaging;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.events.OrderCompletedEvent;
import com.ecommerce.events.PaymentApprovedEvent;
import com.order.service.entities.Order;
import com.order.service.enums.OrderStatus;
import com.order.service.repository.OrdersRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentApprovedListener {

    private final OrdersRepository ordersRepository;
    private final KafkaTemplate<String, OrderCompletedEvent> kafkaTemplate;

    @Value("${app.kafka.topics.order-completed}")
    private String orderCompletedTopic;

    @KafkaListener(topics = "${app.kafka.topics.payment-approved}")
    @Transactional
    public void handle(PaymentApprovedEvent event) {
        if (event == null || !event.approved()) {
            return;
        }
        if (event.paymentId() == null || event.paymentId().isBlank()) {
            log.warn("Skipping payment approval event without paymentId");
            return;
        }

        Order order = ordersRepository.findByPaymentId(event.paymentId())
            .orElse(null);
        if (order == null) {
            log.warn("Order not found for approved payment {}", event.paymentId());
            return;
        }
        if (order.getStatus() == OrderStatus.COMPLETED) {
            log.info("Order {} already completed", order.getId());
            return;
        }

        order.setStatus(OrderStatus.COMPLETED);

        OrderCompletedEvent completedEvent = new OrderCompletedEvent(
            order.getId(),
            order.getUserId(),
            order.getProductIds(),
            order.getTotalPrice(),
            order.getStatus().name(),
            Instant.now()
        );
        kafkaTemplate.send(orderCompletedTopic, String.valueOf(order.getId()), completedEvent);
        log.info("Order {} completed from payment {}", order.getId(), event.paymentId());
    }
}
