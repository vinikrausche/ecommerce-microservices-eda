package com.users.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserResponse(
        Long id,
        String name,
        @JsonProperty("lastname") String lastName,
        String email,
        String address,
        String zipcode,
        @JsonProperty("national_id") String nationalId,
        String phone,
        String state
) {
}
