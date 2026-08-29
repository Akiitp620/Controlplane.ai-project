package com.trustgate.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HumanReviewRequest {

    private Long riskAssessmentId;
    private Long reviewerId;
    private String decision;
    private String modifiedResponse;
    private String comments;
    private String status;
}