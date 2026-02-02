package com.users.service.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.users.service.dto.CreateUserRequest;
import com.users.service.dto.UpdateUserRequest;
import com.users.service.dto.UserResponse;
import com.users.service.entities.User;
import com.users.service.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository repository;

    UserService(UserRepository repository) {
        this.repository = repository;
    }

    public UserResponse create(CreateUserRequest request) {
        User user = new User();
        user.setName(request.name());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setAddress(request.address());
        user.setZipcode(request.zipcode());
        user.setNationalId(request.nationalId());
        user.setPhone(request.phone());
        user.setState(request.state());
        user.setPassword(request.password());

        return toResponse(repository.save(user));
    }

    public UserResponse getById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toResponse(user);
    }

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.name() != null) {
            user.setName(request.name());
        }
        if (request.lastName() != null) {
            user.setLastName(request.lastName());
        }
        if (request.email() != null) {
            user.setEmail(request.email());
        }
        if (request.address() != null) {
            user.setAddress(request.address());
        }
        if (request.zipcode() != null) {
            user.setZipcode(request.zipcode());
        }
        if (request.nationalId() != null) {
            user.setNationalId(request.nationalId());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone());
        }
        if (request.state() != null) {
            user.setState(request.state());
        }
        if (request.password() != null) {
            user.setPassword(request.password());
        }

        return toResponse(user);
    }

    private static UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getLastName(),
                user.getEmail(),
                user.getAddress(),
                user.getZipcode(),
                user.getNationalId(),
                user.getPhone(),
                user.getState()
        );
    }
}
