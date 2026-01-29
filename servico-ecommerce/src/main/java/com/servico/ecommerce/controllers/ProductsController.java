package com.servico.ecommerce.controllers;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.servico.ecommerce.entities.Product;
import com.servico.ecommerce.services.ProductService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/products")
class ProductsController extends Controller {

    private final ProductService productService;

    ProductsController(ProductService productService) {
        this.productService = productService;
    }
    @GetMapping("")
    public List<Product> getAll() {
        return productService.getAll();
    }


    @PostMapping("")
    public ResponseEntity<Product> create(@Valid @RequestBody Product data) {
        Product product = productService.create(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
    
    
}