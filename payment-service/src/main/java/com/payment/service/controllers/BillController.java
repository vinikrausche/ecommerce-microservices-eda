package com.payment.service.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.payment.service.dto.CreateBillRequest;
import com.payment.service.dto.CreateBillResponse;
import com.payment.service.services.BillService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/bills")
@RequiredArgsConstructor
@Validated
public class BillController {

    private final BillService billService;

    @PostMapping("")
    public ResponseEntity<CreateBillResponse> create(@Valid @RequestBody CreateBillRequest request) {
        CreateBillResponse response = billService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
