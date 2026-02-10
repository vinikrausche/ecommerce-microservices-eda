package com.payment.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.payment.service.entities.Bill;

public interface BillRepository extends JpaRepository<Bill, Long> {
}
