package com.trustgate.service;

import org.springframework.stereotype.Service;

@Service
public class PolicyEngine {

    public DecisionResult decide(
            RiskEngine.RiskResult risk,
            String riskTolerance
    ) {

        int overallRisk = risk.overallRiskScore();

        if (risk.contextRiskScore() >= 80 && overallRisk >= 40) {
            return new DecisionResult(
                    "ESCALATE",
                    "High-risk context with unsupported or conflicting evidence requires human review."
            );
        }

        if (overallRisk >= 80) {
            return new DecisionResult(
                    "ESCALATE",
                    "High overall risk requires human review."
            );
        }

        if (overallRisk >= 60) {

            if ("LOW".equalsIgnoreCase(riskTolerance)) {
                return new DecisionResult(
                        "ESCALATE",
                        "Risk exceeds the application's tolerance."
                );
            }

            return new DecisionResult(
                    "WARN",
                    "Response contains moderate risk."
            );
        }

        if (overallRisk >= 40) {
            return new DecisionResult(
                    "MODIFY",
                    "Response should be modified before delivery."
            );
        }

        return new DecisionResult(
                "PASS",
                "Response is within the application's risk tolerance."
        );
    }

    public record DecisionResult(
            String decision,
            String reason
    ) {
    }
}