package com.users.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.br.CPF;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UpdateUserRequest(
        String name,
        @JsonProperty("lastname") String lastName,
        @Email String email,
        String address,
        String zipcode,
        @JsonProperty("national_id") @CPF String nationalId,
        String phone,
        @Size(min = 2, max = 2) String state,
        String password
) {
}
