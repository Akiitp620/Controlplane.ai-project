package com.trustgate.controller;

import com.trustgate.dto.request.AgentActionRequest;
import com.trustgate.dto.response.AgentActionResponse;
import com.trustgate.service.AgentActionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/actions")
public class AgentActionController {

    private final AgentActionService agentActionService;

    public AgentActionController(
            AgentActionService agentActionService
    ) {
        this.agentActionService = agentActionService;
    }

    @PostMapping("/evaluate")
    public AgentActionResponse evaluate(
            @RequestBody AgentActionRequest request
    ) {
        return agentActionService.evaluate(request);
    }
}