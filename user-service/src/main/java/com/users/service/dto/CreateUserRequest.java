package com.users.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.br.CPF;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateUserRequest(
        @NotBlank String name,
        @JsonProperty("lastname") @NotBlank String lastName,
        @Email @NotBlank String email,
        @NotBlank String address,
        @NotBlank String zipcode,
        @JsonProperty("national_id") @NotBlank @CPF String nationalId,
        @NotBlank String phone,
        @Size(min = 2, max = 2) @NotBlank String state,
        @NotBlank String password
) {
}
