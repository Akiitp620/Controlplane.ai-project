package com.trustgate.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AgentActionRequest {

    private Long applicationId;

    private String agentName;

    private String actionType;

    private String actionDescription;

    private Double amount;

    private String userRequest;
}