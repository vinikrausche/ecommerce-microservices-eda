package com.notification.service.messaging;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.ecommerce.events.OrderCompletedEvent;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class OrderCompletedListener {

    @KafkaListener(topics = "${app.kafka.topics.order-completed}")
    public void handle(OrderCompletedEvent event) {
        log.info("Sending notification for order {} (status: {})", event.orderId(), event.status());
    }
}
