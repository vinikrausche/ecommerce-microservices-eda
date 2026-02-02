package com.order.service.messaging;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.ecommerce.events.OrderCompletedEvent;
import com.ecommerce.events.PaymentApprovedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentApprovedListener {

    private final KafkaTemplate<String, OrderCompletedEvent> kafkaTemplate;

    @Value("${app.kafka.topics.order-completed}")
    private String orderCompletedTopic;

    @KafkaListener(topics = "${app.kafka.topics.payment-approved}")
    public void handle(PaymentApprovedEvent event) {
        String status = event.approved() ? "PAYMENT_APPROVED" : "PAYMENT_DECLINED";

        OrderCompletedEvent completedEvent = new OrderCompletedEvent(
            event.orderId(),
            event.userId(),
            event.productId(),
            event.quantity(),
            event.amount(),
            status,
            Instant.now()
        );

        log.info("Payment processed for order {} with status {}", event.orderId(), status);
        kafkaTemplate.send(orderCompletedTopic, event.orderId(), completedEvent);
    }
}
