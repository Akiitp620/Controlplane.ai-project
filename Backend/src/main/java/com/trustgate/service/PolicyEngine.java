package com.trustgate.service;

import org.springframework.stereotype.Service;

@Service
public class PolicyEngine {

    public DecisionResult decide(
            RiskEngine.RiskResult risk,
            String riskTolerance
    ) {
        return decide(
                risk,
                riskTolerance,
                null
        );
    }

    /**
     * Consequence-aware policy decision.
     *
     * Policy order:
     * 1. Critical consequence
     * 2. High consequence
     * 3. Existing high-risk context rule
     * 4. Existing overall-risk rules
     */
    public DecisionResult decide(
            RiskEngine.RiskResult risk,
            String riskTolerance,
            ConsequenceEngine.ConsequenceResult consequence
    ) {

        if (risk == null) {
            return new DecisionResult(
                    "ESCALATE",
                    "Risk assessment is unavailable, so human review is required."
            );
        }

        int overallRisk = risk.overallRiskScore();

        /*
         * =========================================================
         * CONSEQUENCE-AWARE GOVERNANCE
         * =========================================================
         *
         * A low model-risk score must not automatically grant
         * autonomy when the potential business consequence is high.
         */

        if (consequence != null) {

            if (consequence.level()
                    == ConsequenceEngine.ConsequenceLevel.CRITICAL) {

                return new DecisionResult(
                        "ESCALATE",
                        "Critical business consequence requires human review before delivery."
                );
            }

            if (consequence.level()
                    == ConsequenceEngine.ConsequenceLevel.HIGH) {

                if (overallRisk >= 40) {
                    return new DecisionResult(
                            "ESCALATE",
                            "High business consequence combined with elevated AI risk requires human review."
                    );
                }

                return new DecisionResult(
                        "ESCALATE",
                        "High business consequence requires human review even when model risk is low."
                );
            }
        }

        /*
         * =========================================================
         * EXISTING RISK-BASED GOVERNANCE
         * =========================================================
         *
         * Preserve the original ControlPlane risk policy so that
         * consequence-aware governance is an additional control
         * layer rather than a replacement.
         */

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