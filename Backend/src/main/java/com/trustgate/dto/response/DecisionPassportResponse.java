package com.trustgate.dto.response;

import java.time.LocalDateTime;

public record DecisionPassportResponse(
        Long id,
        Long requestId,
        Long riskAssessmentId,
        String decision,
        String finalResponse,
        String reason,
        Boolean humanReviewRequired,
        LocalDateTime createdAt
) {
}