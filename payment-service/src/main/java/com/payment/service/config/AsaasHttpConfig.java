package com.payment.service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class AsaasHttpConfig {
    
    @Bean
    RestClient asaasRestClient( RestClient.Builder builder,
        @Value("${asaas.base-url}") String baseUrl,
        @Value("${asaas.api-key}") String apiKey) {
        String resolvedBaseUrl = baseUrl;
        if (resolvedBaseUrl == null || resolvedBaseUrl.isBlank()) {
            resolvedBaseUrl = "https://api-sandbox.asaas.com";
            log.warn("ASAAS base URL not configured (asaas.base-url). Falling back to sandbox: {}", resolvedBaseUrl);
        } else {
            log.info("ASAAS base URL configured: {}", resolvedBaseUrl);
        }
        if (apiKey == null || apiKey.isBlank()) {
            log.error("ASAAS api key is not configured (asaas.api-key)");
        }
        return builder
        .baseUrl(resolvedBaseUrl)
        .defaultHeader("access_token",apiKey)
        .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build();
    }
}
