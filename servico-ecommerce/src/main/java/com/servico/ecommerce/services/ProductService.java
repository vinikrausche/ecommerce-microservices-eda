package com.servico.ecommerce.services;

import java.util.List;
import org.springframework.stereotype.Service;
import com.servico.ecommerce.entities.Product;
import com.servico.ecommerce.repository.ProductsRepository;

@Service

public class ProductService {
    private final ProductsRepository repo;


    ProductService(ProductsRepository repo) {
        this.repo = repo;
    }


    public Product create(Product data){
        return repo.save(data);
    }

    public List<Product> getAll(){
        return repo.findAll();
    }
}
