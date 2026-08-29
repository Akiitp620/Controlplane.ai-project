package com.trustgate.dto.response;

import java.time.LocalDateTime;

public record UseCaseResponse(
        Long id,
        String useCaseId,
        String name,
        String description,
        String riskTolerance,
        String latencyBudget,
        String evidenceRequirement,
        String humanReviewRule,
        String commonRisks,
        String allowedAutonomy,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
