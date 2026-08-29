package com.trustgate.dto.response;

import java.time.LocalDateTime;

public record AuditResponse(
        Long id,
        String evaluationId,
        String decision,
        String risk,
        String policy,
        String useCase,
        Integer hallucinationScore,
        Integer privacyScore,
        Integer biasScore,
        Integer confidenceScore,
        Integer contextRiskScore,
        Integer overallRiskScore,
        String explanation,
        LocalDateTime createdAt
) {
}
