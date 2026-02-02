package com.payment.service.messaging;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.ecommerce.events.CustomerCreationRequestedEvent;
import com.payment.service.client.AsaasClient;
import com.payment.service.dto.CreateCustomerRequest;
import com.payment.service.dto.CreateCustomerResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class CreateCustomerListen {

    private final AsaasClient asaasClient;

    @KafkaListener(topics = "${app.kafka.topics.creation-customer-requested}")
    public void handle(CustomerCreationRequestedEvent event) {
        CreateCustomerRequest request = toRequest(event);
        var response = asaasClient.createCustomer(request);
        CreateCustomerResponse body = response.getBody();
        if (body != null) {
            log.info("Asaas customer created for user {}: {}", event.userId(), body.id());
        } else {
            log.info("Asaas customer created for user {} with status {}", event.userId(), response.getStatusCode());
        }
    }

    private static CreateCustomerRequest toRequest(CustomerCreationRequestedEvent event) {
        String baseName = event.name() == null ? "" : event.name().trim();
        String lastName = event.lastName() == null ? "" : event.lastName().trim();
        String fullName = baseName.isEmpty() ? lastName : baseName;
        if (!lastName.isEmpty() && !fullName.equals(lastName)) {
            fullName = (baseName + " " + lastName).trim();
        }
        String externalReference = event.userId() == null ? null : "user_" + event.userId();

        return new CreateCustomerRequest(
                fullName.isEmpty() ? event.email() : fullName,
                event.nationalId(),
                event.email(),
                event.phone(),
                event.phone(),
                event.address(),
                null,
                null,
                null,
                event.zipcode(),
                externalReference,
                Boolean.FALSE,
                null,
                null,
                null,
                null,
                null,
                null,
                Boolean.FALSE
        );
    }
}
