package com.trustgate.service;

import com.trustgate.model.Application;
import com.trustgate.model.RiskProfile;
import org.springframework.stereotype.Service;

@Service
public class ContextEngine {

    public ContextResult analyze(Application application, RiskProfile riskProfile) {
        return new ContextResult(
                application.getType(),
                riskProfile.getRiskTolerance(),
                calculateContextRisk(application.getType())
        );
    }

    private int calculateContextRisk(String applicationType) {

        if (applicationType == null) {
            return 50;
        }

        return switch (applicationType.toUpperCase()) {
            case "HEALTHCARE" -> 90;
            case "BANKING" -> 85;
            case "HR" -> 80;
            case "EDUCATION" -> 60;
            case "DECISION_SUPPORT" -> 70;
            case "CUSTOMER_SUPPORT" -> 45;
            case "MARKETING" -> 30;
            default -> 50;
        };
    }

    public record ContextResult(
            String applicationType,
            String riskTolerance,
            int contextRisk
    ) {
    }
}
