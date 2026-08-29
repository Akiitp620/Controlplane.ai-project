package com.trustgate.controller;

import com.trustgate.dto.request.UpdateUserProfileRequest;
import com.trustgate.dto.response.UserProfileResponse;
import com.trustgate.model.User;
import com.trustgate.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserRepository userRepository;

    public UserProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public UserProfileResponse getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        User user = authenticatedUser(authentication);

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    @PutMapping
    public UserProfileResponse updateUserProfile(
            @RequestBody UpdateUserProfileRequest request
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        User user = authenticatedUser(authentication);

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            // Check if new email is already taken
            String newEmail = request.getEmail().trim().toLowerCase();
            if (!newEmail.equals(user.getEmail()) && userRepository.findByEmail(newEmail).isPresent()) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(newEmail);
        }

        User updated = userRepository.save(user);

        return new UserProfileResponse(
                updated.getId(),
                updated.getName(),
                updated.getEmail(),
                updated.getRole()
        );
    }

    private User authenticatedUser(Authentication authentication) {
        if (authentication.getPrincipal() instanceof User user) {
            return user;
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
