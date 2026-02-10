package com.order.service.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@Configuration
public class PaymentHttpConfig {
    

    @Bean
    RestClient paymentRestClient( RestClient.Builder builder,
        @Value("${payment.base-url}") String baseUrl, @Value("${payment.api-key}") String apiKey) {
        return builder
        .baseUrl(baseUrl)
        .defaultHeader("access_token", apiKey, null)
        .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build();
    }
}
