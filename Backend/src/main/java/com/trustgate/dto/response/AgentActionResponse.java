package com.trustgate.dto.response;

import java.util.List;

public record AgentActionResponse(

        String decision,

        int riskScore,

        String reason,

        boolean requiresHumanReview,

        List<String> evidence,

        Long passportId

) {
}