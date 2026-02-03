package com.payment.service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.payment.service.entities.AsaasCustomer;

public interface AsaasCustomerRepository extends JpaRepository<AsaasCustomer, Long> {
    boolean existsByUserId(Long userId);
    boolean existsByAsaasId(String asaasId);
    Optional<AsaasCustomer> findByUserId(Long userId);
    Optional<AsaasCustomer> findByAsaasId(String asaasId);
}
