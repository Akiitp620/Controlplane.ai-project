package com.trustgate.service;

import com.trustgate.dto.request.LoginRequest;
import com.trustgate.dto.request.RegisterRequest;
import com.trustgate.dto.response.AuthResponse;
import com.trustgate.model.User;
import com.trustgate.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setActive(true);

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(
                savedUser.getEmail(),
                savedUser.getRole()
        );

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                token,
                "Registration successful"
        );
    }

    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        System.out.println("LOGIN EMAIL: [" + email + "]");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        System.out.println("LOGIN USER FOUND: " + user.getEmail());

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new RuntimeException("User account is inactive");
        }

        if (user.getPassword() == null) {
            throw new RuntimeException("User password is not configured");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            System.out.println("LOGIN PASSWORD MATCH: false");
            throw new RuntimeException("Invalid email or password");
        }

        System.out.println("LOGIN PASSWORD MATCH: true");

        String role = user.getRole() == null
                ? "USER"
                : user.getRole().toUpperCase();

        String token = jwtService.generateToken(
                user.getEmail(),
                role
        );

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                role,
                token,
                "Login successful"
        );
    }
}