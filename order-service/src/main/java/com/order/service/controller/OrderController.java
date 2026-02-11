package com.order.service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.order.service.client.PaymentClient;
import com.order.service.context.RequestUserContext;
import com.order.service.dto.CheckoutRequest;
import com.order.service.dto.CheckoutResponse;
import com.order.service.dto.CreateBillRequest;
import com.order.service.dto.CreateBillResponse;
import com.order.service.entities.Order;
import com.order.service.services.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Validated
public class OrderController {

    private final OrderService orderService;
    private final PaymentClient paymentClient;

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        Long authenticatedUserId = RequestUserContext.requireUserId();

        CreateBillResponse bill = paymentClient.createBill(new CreateBillRequest(
            authenticatedUserId,
            request.paymentMethod(),
            request.amount(),
            "Pedido do usuario " + authenticatedUserId
        ));

        Order order = orderService.createOrder(
            authenticatedUserId,
            request.productIds(),
            request.amount(),
            request.paymentMethod(),
            bill.id(),
            bill.customerId(),
            bill.paymentLink(),
            bill.invoiceUrl(),
            bill.pixQrCodeImage(),
            bill.pixCopyPaste()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
            new CheckoutResponse(
                order.getId(),
                order.getStatus().name(),
                bill.paymentLink() == null || bill.paymentLink().isBlank() ? bill.invoiceUrl() : bill.paymentLink(),
                bill.invoiceUrl(),
                bill.pixQrCodeImage(),
                bill.pixCopyPaste()
            )
        );
    }
}
