package com.trustgate.controller;

import com.trustgate.dto.response.AuditResponse;
import com.trustgate.model.RiskAssessment;
import com.trustgate.model.DecisionPassport;
import com.trustgate.repository.DecisionPassportRepository;
import com.trustgate.repository.RiskAssessmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    private final RiskAssessmentRepository riskAssessmentRepository;
    private final DecisionPassportRepository decisionPassportRepository;

    public AuditController(RiskAssessmentRepository riskAssessmentRepository,
                           DecisionPassportRepository decisionPassportRepository) {
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.decisionPassportRepository = decisionPassportRepository;
    }

    @GetMapping
    public List<AuditResponse> getAuditTrail() {
        return riskAssessmentRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public AuditResponse getAuditById(@PathVariable Long id) {
        RiskAssessment assessment = riskAssessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit record not found"));
        return toResponse(assessment);
    }

    private AuditResponse toResponse(RiskAssessment assessment) {
        // Generate a consistent evaluation ID based on the assessment ID and creation time
        String evaluationId = "EVAL-" + assessment.getId();
        
        // Determine risk level from overall risk score
        String riskLevel = "MEDIUM";
        if (assessment.getOverallRiskScore() != null) {
            if (assessment.getOverallRiskScore() > 70) {
                riskLevel = "CRITICAL";
            } else if (assessment.getOverallRiskScore() > 50) {
                riskLevel = "HIGH";
            } else if (assessment.getOverallRiskScore() > 30) {
                riskLevel = "MEDIUM";
            } else {
                riskLevel = "LOW";
            }
        }

        DecisionPassport passport = decisionPassportRepository
            .findByRiskAssessmentId(assessment.getId())
            .orElse(null);

        // Fall back to score thresholds only for legacy assessments without a passport.
        String decision = "ALLOW";
        if (passport != null && passport.getDecision() != null) {
            decision = switch (passport.getDecision().toUpperCase()) {
                case "PASS", "ALLOW", "APPROVE" -> "ALLOW";
                case "MODIFY" -> "MODIFY";
                case "WARN", "ESCALATE", "HUMAN_REVIEW" -> "HUMAN_REVIEW";
                case "BLOCK", "REJECT" -> "BLOCK";
                default -> passport.getDecision();
            };
        } else if (assessment.getOverallRiskScore() != null) {
            if (assessment.getOverallRiskScore() > 70) {
                decision = "BLOCK";
            } else if (assessment.getOverallRiskScore() > 50) {
                decision = "HUMAN_REVIEW";
            } else if (assessment.getOverallRiskScore() > 30) {
                decision = "MODIFY";
            }
        }

        return new AuditResponse(
                assessment.getId(),
                evaluationId,
                decision,
                riskLevel,
                "Default Policy v1",
                "general",
                assessment.getHallucinationScore() != null ? assessment.getHallucinationScore() : 0,
                assessment.getPrivacyScore() != null ? assessment.getPrivacyScore() : 0,
                assessment.getBiasScore() != null ? assessment.getBiasScore() : 0,
                assessment.getConfidenceScore() != null ? assessment.getConfidenceScore() : 0,
                assessment.getContextRiskScore() != null ? assessment.getContextRiskScore() : 0,
                assessment.getOverallRiskScore() != null ? assessment.getOverallRiskScore() : 0,
                assessment.getExplanation() != null ? assessment.getExplanation() : "No explanation provided",
                assessment.getCreatedAt()
        );
    }
}
