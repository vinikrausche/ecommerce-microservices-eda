package com.payment.service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateCustomerResponse(
        String object,
        String id,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate dateCreated,
        String name,
        String email,
        String phone,
        String mobilePhone,
        String address,
        String addressNumber,
        String complement,
        String province,
        Integer city,
        String cityName,
        String state,
        String country,
        String postalCode,
        String cpfCnpj,
        String personType,
        Boolean deleted,
        String additionalEmails,
        String externalReference,
        Boolean notificationDisabled,
        String observations,
        Boolean foreignCustomer
) {
}
