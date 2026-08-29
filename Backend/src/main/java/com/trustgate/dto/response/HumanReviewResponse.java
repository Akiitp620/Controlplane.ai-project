package com.trustgate.dto.response;

import java.time.LocalDateTime;

public record HumanReviewResponse(
        Long id,
        Long riskAssessmentId,
        Long reviewerId,
        String decision,
        String modifiedResponse,
        String comments,
        String status,
        LocalDateTime createdAt,
        LocalDateTime reviewedAt
) {
}