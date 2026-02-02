package com.users.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.users.service.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
