package com.payment.service.services;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.payment.service.client.AsaasClient;
import com.payment.service.dto.CreateBillRequest;
import com.payment.service.dto.CreateBillResponse;
import com.payment.service.dto.CreateChargeRequest;
import com.payment.service.dto.CreateChargeResponse;
import com.payment.service.dto.PixQrCodeResponse;
import com.payment.service.entities.Bill;
import com.payment.service.repository.AsaasCustomerRepository;
import com.payment.service.repository.BillRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BillService {

    private final AsaasClient asaasClient;
    private final AsaasCustomerRepository asaasCustomerRepository;
    private final BillRepository billRepository;

    public CreateBillResponse create(CreateBillRequest request) {
        var customer = asaasCustomerRepository.findByUserId(request.userId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Asaas customer not found"));
        String customerId = customer.getCustomerId();
        if (customerId == null || customerId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer id not found for informed user");
        }

        CreateChargeRequest chargeRequest = new CreateChargeRequest(
            customerId,
            mapBillingType(request.billingType()),
            request.value(),
            LocalDate.now().plusDays(1),
            request.description(),
            null,
            null,
            null,
            null,
            null
        );

        var response = asaasClient.createCharge(chargeRequest);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to create payment on Asaas");
        }

        CreateChargeResponse body = response.getBody();
        String invoiceUrl = body.invoiceUrl();
        String paymentLink = body.paymentLink();
        String pixQrCodeImage = null;
        String pixCopyPaste = null;

        if (request.billingType() == CreateBillRequest.PaymentMethod.PIX) {
            var pixResponse = asaasClient.getPixQrCode(body.id());
            if (!pixResponse.getStatusCode().is2xxSuccessful() || pixResponse.getBody() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to retrieve PIX QR Code on Asaas");
            }
            PixQrCodeResponse pixBody = pixResponse.getBody();
            pixQrCodeImage = toDataImage(pixBody.encodedImage());
            pixCopyPaste = pixBody.payload();
            if (pixQrCodeImage != null && !pixQrCodeImage.isBlank()) {
                // For PIX, invoice content can be the QR image itself.
                invoiceUrl = pixQrCodeImage;
            }
        }

        String billCustomerId = body.customer() == null || body.customer().isBlank()
            ? customerId
            : body.customer();

        Bill bill = new Bill();
        bill.setPaymentId(body.id());
        bill.setCustomerId(billCustomerId);
        bill.setStatus(body.status());
        bill.setDateCreated(body.dateCreated());
        bill.setInvoiceUrl(invoiceUrl);
        bill.setPaymentLink(paymentLink);
        bill.setPixQrCodeImage(pixQrCodeImage);
        bill.setPixCopyPaste(pixCopyPaste);
        billRepository.save(bill);

        return new CreateBillResponse(
            body.id(),
            billCustomerId,
            body.dateCreated(),
            invoiceUrl,
            paymentLink,
            pixQrCodeImage,
            pixCopyPaste
        );
    }

    private static CreateChargeRequest.BillingType mapBillingType(CreateBillRequest.PaymentMethod method) {
        return switch (method) {
            case PIX -> CreateChargeRequest.BillingType.PIX;
            case CREDIT_CARD -> CreateChargeRequest.BillingType.CREDIT_CARD;
            case DEBIT_CARD -> CreateChargeRequest.BillingType.CREDIT_CARD;
        };
    }

    private static String toDataImage(String encodedImage) {
        if (encodedImage == null || encodedImage.isBlank()) {
            return null;
        }
        if (encodedImage.startsWith("data:")) {
            return encodedImage;
        }
        return "data:image/png;base64," + encodedImage;
    }
}
