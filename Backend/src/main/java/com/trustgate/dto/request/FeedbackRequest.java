package com.trustgate.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequest {

    private Long decisionPassportId;
    private String actualDecision;
    private Integer rating;
    private String comments;
}