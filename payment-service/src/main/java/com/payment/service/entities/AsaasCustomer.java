package com.payment.service.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "asaas_customers",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_asaas_customers_users_id", columnNames = "users_id"),
        @UniqueConstraint(name = "uk_asaas_customers_asaas_id", columnNames = "asaas_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AsaasCustomer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asaas_id", nullable = false)
    private String asaasId;

    @Column(name = "users_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;
}
