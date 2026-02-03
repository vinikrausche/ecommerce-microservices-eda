package com.payment.service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.events.CustomerCreationRequestedEvent;
import com.payment.service.dto.CreateCustomerResponse;
import com.payment.service.entities.AsaasCustomer;
import com.payment.service.repository.AsaasCustomerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AsaasCustomerService {

    private final AsaasCustomerRepository repository;

    public boolean existsByUserId(Long userId) {
        return repository.existsByUserId(userId);
    }

    public List<AsaasCustomer> findAll() {
        return repository.findAll();
    }

    public AsaasCustomer saveFrom(CustomerCreationRequestedEvent event, CreateCustomerResponse response) {
        if (response.id() != null) {
            var existing = repository.findByAsaasId(response.id());
            if (existing.isPresent()) {
                return existing.get();
            }
        }
        AsaasCustomer customer = new AsaasCustomer();
        customer.setAsaasId(response.id());
        customer.setUserId(event.userId());
        customer.setName(resolveName(event, response));
        customer.setEmail(resolveEmail(event, response));
        return repository.save(customer);
    }

    private static String resolveName(CustomerCreationRequestedEvent event, CreateCustomerResponse response) {
        String responseName = response.name();
        if (responseName != null && !responseName.isBlank()) {
            return responseName.trim();
        }

        String baseName = event.name() == null ? "" : event.name().trim();
        String lastName = event.lastName() == null ? "" : event.lastName().trim();
        String fullName = baseName.isEmpty() ? lastName : baseName;
        if (!lastName.isEmpty() && !fullName.equals(lastName)) {
            fullName = (baseName + " " + lastName).trim();
        }
        if (!fullName.isEmpty()) {
            return fullName;
        }

        String email = resolveEmail(event, response);
        return email == null ? "" : email;
    }

    private static String resolveEmail(CustomerCreationRequestedEvent event, CreateCustomerResponse response) {
        String responseEmail = response.email();
        if (responseEmail != null && !responseEmail.isBlank()) {
            return responseEmail.trim();
        }
        return event.email() == null ? "" : event.email().trim();
    }
}
