package com.order.service.client;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.order.service.dto.StoreProductResponse;

@Component
public class StoreClient {

    private final RestClient store;

    StoreClient(@Qualifier("storeRestClient") RestClient storeRestClient) {
        this.store = storeRestClient;
    }

    public StoreProductResponse getById(Long productId) {
        StoreProductResponse response = store.get()
            .uri("/api/v1/products/{id}", productId)
            .retrieve()
            .body(StoreProductResponse.class);

        if (response == null) {
            throw new IllegalStateException("Store service returned empty product payload");
        }
        return response;
    }
}
