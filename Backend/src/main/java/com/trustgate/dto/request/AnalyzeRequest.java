package com.trustgate.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnalyzeRequest {

    private Long applicationId;
    private String userRequest;
    private String aiResponse;
}
