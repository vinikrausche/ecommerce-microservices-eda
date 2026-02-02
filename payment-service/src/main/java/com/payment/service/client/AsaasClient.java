package com.payment.service.client;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.payment.service.dto.CreateChargeRequest;
import com.payment.service.dto.CreateChargeResponse;

@Component
public class AsaasClient {

    private final RestClient asaas;

    AsaasClient(RestClient asaasClient) {
        this.asaas = asaasClient;
    }

    public final ResponseEntity<CreateChargeResponse> createCharge(CreateChargeRequest request) {
        return asaas.postForEntity("/v3/payments", request, CreateChargeResponse.class);
    }
}
