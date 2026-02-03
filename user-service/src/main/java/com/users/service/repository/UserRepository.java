package com.users.service.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.users.service.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {


    public Optional<User> findByEmail(String email);
}
