package com.trustgate.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUseCaseRequest {

    private String useCaseId;

    private String name;

    private String description;

    private String riskTolerance;

    private String latencyBudget;

    private String evidenceRequirement;

    private String humanReviewRule;

    private String commonRisks;

    private String allowedAutonomy;

    private String status;
}
