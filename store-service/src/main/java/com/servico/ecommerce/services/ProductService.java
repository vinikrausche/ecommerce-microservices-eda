package com.servico.ecommerce.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.servico.ecommerce.entities.Product;
import com.servico.ecommerce.repository.ProductsRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class ProductService {
    private final ProductsRepository repo;

    ProductService(ProductsRepository repo) {
        this.repo = repo;
    }

    public Product create(Product data) {
        return repo.save(data);
    }

    public List<Product> getAll() {
        return repo.findAll();
    }

    @Transactional
    public Product update(Long id, Product data) {
        Product currentProduct = repo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        currentProduct.setTitulo(data.getTitulo());
        currentProduct.setDescricao(data.getDescricao());
        currentProduct.setFotos(data.getFotos());
        currentProduct.setPreco(data.getPreco());
        currentProduct.setQuantidade(data.getQuantidade());

        return currentProduct;
    }

    @Transactional
    public void decreaseQuantity(Long productId, Integer quantity) {
        Product currentProduct = repo.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        int current = currentProduct.getQuantidade() == null ? 0 : currentProduct.getQuantidade();
        int decrement = quantity == null ? 0 : quantity;
        int newQuantity = Math.max(0, current - Math.max(0, decrement));

        currentProduct.setQuantidade(newQuantity);
    }
}
