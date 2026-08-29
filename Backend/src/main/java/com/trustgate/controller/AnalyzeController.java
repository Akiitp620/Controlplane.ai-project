package com.trustgate.controller;

import com.trustgate.dto.request.AnalyzeRequest;
import com.trustgate.dto.response.AnalyzeResponse;
import com.trustgate.service.TrustGateService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyze")
public class AnalyzeController {

    private final TrustGateService trustGateService;

    public AnalyzeController(TrustGateService trustGateService) {
        this.trustGateService = trustGateService;
    }

    @PostMapping
    public AnalyzeResponse analyze(@RequestBody AnalyzeRequest request) {
        return trustGateService.analyze(request);
    }
}