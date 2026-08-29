package com.trustgate.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DecisionPassportRequest {

    private Long riskAssessmentId;
    private String decision;
    private String finalResponse;
    private String reason;
    private Boolean humanReviewRequired;
}