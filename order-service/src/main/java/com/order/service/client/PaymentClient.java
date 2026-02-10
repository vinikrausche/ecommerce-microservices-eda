package com.order.service.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.order.service.dto.CreateBillRequest;
import com.order.service.dto.CreateBillResponse;

@Component
public class PaymentClient {

    private final RestClient payment;

    PaymentClient(RestClient paymentRestClient) {
        this.payment = paymentRestClient;
    }

    public CreateBillResponse createBill(CreateBillRequest request) {
        CreateBillResponse response = payment.post()
            .uri("/api/v1/bills")
            .body(request)
            .retrieve()
            .body(CreateBillResponse.class);

        if (response == null) {
            throw new IllegalStateException("Payment service returned empty response");
        }

        return response;
    }
}
