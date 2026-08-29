package com.trustgate.dto.response;

public record MetricsResponse(
        Long totalEvaluations,
        Long allowedDecisions,
        Long modifyDecisions,
        Long reviewDecisions,
        Long blockedDecisions,
        Double averageRiskScore,
        Long highRiskCount,
        Long mediumRiskCount,
        Long lowRiskCount
) {
}
