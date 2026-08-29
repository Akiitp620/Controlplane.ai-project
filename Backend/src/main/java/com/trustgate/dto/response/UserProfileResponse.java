package com.trustgate.dto.response;

public record UserProfileResponse(
        Long id,
        String name,
        String email,
        String role
) {
}
