package com.trustgate.dto.response;

import java.time.LocalDateTime;

public record FeedbackResponse(
        Long id,
        Long decisionPassportId,
        String actualDecision,
        Integer rating,
        String comments,
        LocalDateTime createdAt
) {
}