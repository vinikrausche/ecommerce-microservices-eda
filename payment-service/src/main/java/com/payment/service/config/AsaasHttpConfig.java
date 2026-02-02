package com.payment.service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

@Configuration
public class AsaasHttpConfig {
    
    @Bean
    RestClient asaasRestClient( RestClient.Builder builder,
        @Value("${asaas.base-url}") String baseUrl,
        @Value("${asaas.api-key}") String apiKey) {
        return builder
        .baseUrl(baseUrl)
        .defaultHeader("access_token",apiKey)
        .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build();
    }
}
