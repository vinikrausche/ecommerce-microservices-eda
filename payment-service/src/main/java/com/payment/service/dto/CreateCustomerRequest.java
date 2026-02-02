package com.payment.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateCustomerRequest(
        String name,
        String cpfCnpj,
        String email,
        String phone,
        String mobilePhone,
        String address,
        String addressNumber,
        String complement,
        String province,
        String postalCode,
        String externalReference,
        Boolean notificationDisabled,
        String additionalEmails,
        String municipalInscription,
        String stateInscription,
        String observations,
        String groupName,
        String company,
        Boolean foreignCustomer
) {
}
