package com.order.service.messaging;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.ecommerce.events.OrderCompletedEvent;
import com.ecommerce.events.PaymentApprovedEvent;
import com.order.service.enums.OrderStatus;
import com.order.service.services.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentApprovedListener {

    private final KafkaTemplate<String, OrderCompletedEvent> kafkaTemplate;
    private final OrderService orderService;

    @Value("${app.kafka.topics.order-completed}")
    private String orderCompletedTopic;

    @KafkaListener(topics = "${app.kafka.topics.payment-approved}")
    public void handle(PaymentApprovedEvent event) {
        OrderStatus status = event.approved()
            ? OrderStatus.PAYMENT_APPROVED
            : OrderStatus.PAYMENT_DECLINED;

        orderService.updateStatus(event.orderId(), status);

        OrderCompletedEvent completedEvent = new OrderCompletedEvent(
            event.orderId(),
            event.userId(),
            event.productIds(),
            event.amount(),
            status.name(),
            Instant.now()
        );

        log.info("Payment processed for order {} with status {}", event.orderId(), status.name());
        kafkaTemplate.send(orderCompletedTopic, String.valueOf(event.orderId()), completedEvent);
    }
}
