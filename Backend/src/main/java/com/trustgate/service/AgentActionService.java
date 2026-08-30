package com.trustgate.service;

import com.trustgate.dto.request.AgentActionRequest;
import com.trustgate.dto.response.AgentActionResponse;
import com.trustgate.model.Application;
import com.trustgate.model.RiskProfile;
import com.trustgate.repository.ApplicationRepository;
import com.trustgate.repository.RiskProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgentActionService {

    private final ApplicationRepository applicationRepository;
    private final RiskProfileRepository riskProfileRepository;
    private final ContextEngine contextEngine;

    public AgentActionService(
            ApplicationRepository applicationRepository,
            RiskProfileRepository riskProfileRepository,
            ContextEngine contextEngine
    ) {
        this.applicationRepository = applicationRepository;
        this.riskProfileRepository = riskProfileRepository;
        this.contextEngine = contextEngine;
    }

    public AgentActionResponse evaluate(AgentActionRequest request) {

        if (request.getApplicationId() == null) {
            throw new IllegalArgumentException("applicationId is required");
        }

        Application application = applicationRepository
                .findById(request.getApplicationId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Application not found"));

        RiskProfile riskProfile = riskProfileRepository
                .findByApplicationId(application.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Risk profile not found"));

        ContextEngine.ContextResult context =
                contextEngine.analyze(application, riskProfile);

        String actionType = request.getActionType() == null
                ? ""
                : request.getActionType().trim().toUpperCase();

        double amount = request.getAmount() == null
                ? 0
                : request.getAmount();

        /*
         * Deterministic demo action rules.
         *
         * IMPORTANT:
         * This is an action-governance layer only.
         * No external action is executed here.
         */

        if ("SEND_PASSWORD_RESET_EMAIL".equals(actionType)) {

            return new AgentActionResponse(
                    "ALLOW",
                    15,
                    "Low-risk operational action can proceed autonomously.",
                    false,
                    List.of(),
                    null
            );
        }

        if ("ISSUE_REFUND".equals(actionType)) {

            if (amount >= 10000) {

                return new AgentActionResponse(
                        "HUMAN_REVIEW",
                        Math.min(95, context.contextRisk() + 15),
                        "Refund amount exceeds the autonomous approval threshold and requires human review.",
                        true,
                        List.of(
                                "Refund actions above the autonomous threshold require human oversight."
                        ),
                        null
                );
            }

            if (amount > 0) {

                return new AgentActionResponse(
                        "ALLOW",
                        Math.min(55, context.contextRisk() - 10),
                        "Refund amount is within the autonomous operating threshold.",
                        false,
                        List.of(
                                "Refund amount is below the configured human-review threshold."
                        ),
                        null
                );
            }

            return new AgentActionResponse(
                    "MODIFY",
                    50,
                    "Refund amount is required before the action can be evaluated.",
                    false,
                    List.of(
                            "A valid refund amount must be provided."
                    ),
                    null
            );
        }

        return new AgentActionResponse(
                "HUMAN_REVIEW",
                Math.min(80, context.contextRisk() + 10),
                "Unknown or unclassified agent action requires human oversight.",
                true,
                List.of(
                        "Action type is not registered in the autonomous action policy."
                ),
                null
        );
    }
}