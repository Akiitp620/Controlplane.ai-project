package com.trustgate.dto.response;

import java.time.LocalDateTime;

public record PolicyResponse(
        Long id,
        String name,
        String useCase,
        String riskTolerance,
        String evidenceRequirement,
        String humanReviewRequirement,
        Integer version,
        String status,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
