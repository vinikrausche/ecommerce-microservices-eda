package com.payment.service.client;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.payment.service.dto.CreateChargeRequest;
import com.payment.service.dto.CreateChargeResponse;
import com.payment.service.dto.CreateCustomerRequest;
import com.payment.service.dto.CreateCustomerResponse;
import com.payment.service.dto.PixQrCodeResponse;

@Component
public class AsaasClient {

    private final RestClient asaas;

    AsaasClient(RestClient asaasClient) {
        this.asaas = asaasClient;
    }

    public final ResponseEntity<CreateChargeResponse> createCharge(CreateChargeRequest request) {
        return asaas.post()
        .uri("/v3/payments")
        .body(request)
        .retrieve()
        .toEntity(CreateChargeResponse.class);
    }

    public final ResponseEntity<CreateCustomerResponse> createCustomer(CreateCustomerRequest request) {
        return asaas.post()
        .uri("/v3/customers")
        .body(request)
        .retrieve()
        .toEntity(CreateCustomerResponse.class);
    }

    public final ResponseEntity<PixQrCodeResponse> getPixQrCode(String paymentId) {
        return asaas.get()
        .uri("/v3/payments/{id}/pixQrCode", paymentId)
        .retrieve()
        .toEntity(PixQrCodeResponse.class);
    }
}
