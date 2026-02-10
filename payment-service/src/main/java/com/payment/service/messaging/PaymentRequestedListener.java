package com.payment.service.messaging;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.ecommerce.events.PaymentApprovedEvent;
import com.ecommerce.events.PaymentRequestedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentRequestedListener {

    private final KafkaTemplate<String, PaymentApprovedEvent> kafkaTemplate;

    @Value("${app.kafka.topics.payment-approved}")
    private String paymentApprovedTopic;

    @KafkaListener(topics = "${app.kafka.topics.payment-requested}")
    public void handle(PaymentRequestedEvent event) {
        boolean approved = true;

        PaymentApprovedEvent approvedEvent = new PaymentApprovedEvent(
            event.orderId(),
            event.userId(),
            event.productIds(),
            event.amount(),
            approved,
            Instant.now()
        );

        log.info("Payment approved for order {}", event.orderId());
        kafkaTemplate.send(paymentApprovedTopic, String.valueOf(event.orderId()), approvedEvent);
    }
}
