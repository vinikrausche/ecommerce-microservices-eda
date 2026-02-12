package com.order.service.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import com.order.service.client.StoreClient;
import com.order.service.dto.StoreProductResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderQuoteService {

    private final StoreClient storeClient;

    public BigDecimal calculateValidatedTotal(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product list cannot be empty");
        }

        Map<Long, Long> quantitiesByProduct = productIds.stream()
            .filter(productId -> productId != null)
            .collect(Collectors.groupingBy(productId -> productId, Collectors.counting()));

        if (quantitiesByProduct.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product list cannot contain only null values");
        }

        BigDecimal total = BigDecimal.ZERO;
        for (Map.Entry<Long, Long> item : quantitiesByProduct.entrySet()) {
            Long productId = item.getKey();
            int requestedQuantity = Math.toIntExact(item.getValue());

            StoreProductResponse product = fetchProduct(productId);
            Integer available = product.quantidade() == null ? 0 : product.quantidade();
            if (available < requestedQuantity) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Insufficient stock for product " + productId
                );
            }
            if (product.preco() == null || product.preco().signum() <= 0) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid price for product " + productId
                );
            }

            total = total.add(product.preco().multiply(BigDecimal.valueOf(requestedQuantity)));
        }

        return total;
    }

    private StoreProductResponse fetchProduct(Long productId) {
        try {
            return storeClient.getById(productId);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product not found: " + productId, ex);
        } catch (RestClientException ex) {
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Store service unavailable during checkout",
                ex
            );
        }
    }
}
