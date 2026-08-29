package com.trustgate.controller;

import com.trustgate.dto.request.DecisionPassportRequest;
import com.trustgate.dto.response.DecisionPassportResponse;
import com.trustgate.service.DecisionPassportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decision-passports")
public class DecisionPassportController {

    private final DecisionPassportService decisionPassportService;

    public DecisionPassportController(
            DecisionPassportService decisionPassportService
    ) {
        this.decisionPassportService = decisionPassportService;
    }

    @PostMapping
    public DecisionPassportResponse createPassport(
            @RequestBody DecisionPassportRequest request
    ) {
        return decisionPassportService.createPassport(request);
    }

    @GetMapping
    public List<DecisionPassportResponse> getAllPassports() {
        return decisionPassportService.getAllPassports();
    }

    @GetMapping("/{id}")
    public DecisionPassportResponse getPassportById(
            @PathVariable Long id
    ) {
        return decisionPassportService.getPassportById(id);
    }
}