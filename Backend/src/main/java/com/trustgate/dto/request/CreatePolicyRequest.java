package com.trustgate.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePolicyRequest {

    private String name;

    private String useCase;

    private String riskTolerance;

    private String evidenceRequirement;

    private String humanReviewRequirement;

    private String description;

    private String status;

    private Integer version;
}
