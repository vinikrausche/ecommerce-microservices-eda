package com.ecommerce.events;

public record CustomerCreationRequestedEvent(
    Long userId,
    String name,
    String lastName,
    String email,
    String nationalId,
    String phone,
    String address,
    String zipcode,
    String state
) {}
