package com.order.service.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.order.service.client.PaymentClient;
import com.order.service.context.RequestUserContext;
import com.order.service.dto.CheckoutRequest;
import com.order.service.dto.CheckoutResponse;
import com.order.service.dto.CreateBillRequest;
import com.order.service.dto.CreateBillResponse;
import com.order.service.entities.Order;
import com.order.service.services.OrderQuoteService;
import com.order.service.services.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Validated
@Slf4j
public class OrderController {

    private final OrderService orderService;
    private final OrderQuoteService orderQuoteService;
    private final PaymentClient paymentClient;

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        Long authenticatedUserId = RequestUserContext.requireUserId();
        if (request.userId() != null && !request.userId().equals(authenticatedUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Checkout userId does not match authenticated user");
        }
        BigDecimal validatedAmount = orderQuoteService.calculateValidatedTotal(request.productIds())
            .setScale(2, RoundingMode.HALF_UP);
        BigDecimal requestedAmount = request.amount().setScale(2, RoundingMode.HALF_UP);
        if (requestedAmount.compareTo(validatedAmount) != 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Checkout amount does not match products total");
        }

        CreateBillResponse bill = paymentClient.createBill(new CreateBillRequest(
            authenticatedUserId,
            request.paymentMethod(),
            validatedAmount,
            "Pedido do usuario " + authenticatedUserId
        ));

        Order order = orderService.createOrder(
            authenticatedUserId,
            request.productIds(),
            validatedAmount,
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
