package com.servico.ecommerce.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.servico.ecommerce.dto.AddProductCartRequest;
import com.servico.ecommerce.dto.AddProductCartResponse;
import com.servico.ecommerce.entities.Cart;
import com.servico.ecommerce.enums.CartStatus;
import com.servico.ecommerce.services.CartService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService service;
    

    CartController(CartService service){
        this.service = service;
    }

    @PostMapping("")
    public ResponseEntity<AddProductCartResponse>  addProducts(@Valid @RequestBody AddProductCartRequest dto) {

        
        if(dto.id() == null){
          Cart cart = Cart.builder()
            .cartItems(dto.cart_items())
            .userId(dto.user_id())
            .status(dto.status() == null ? CartStatus.ACTIVE : dto.status())
            .build();

          Cart created = service.create(cart);
          return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(new AddProductCartResponse(created.getId(), created.getCartItems()));
        }



        Cart updated = service.addItems(dto.id(), dto.cart_items());
        return ResponseEntity
          .status(HttpStatus.CREATED)
          .body(new AddProductCartResponse(updated.getId(), updated.getCartItems()));


    }

}
