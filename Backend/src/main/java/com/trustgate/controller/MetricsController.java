package com.trustgate.controller;

import com.trustgate.dto.response.MetricsResponse;
import com.trustgate.model.RiskAssessment;
import com.trustgate.repository.RiskAssessmentRepository;
import com.trustgate.repository.DecisionPassportRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
public class MetricsController {

    private final RiskAssessmentRepository riskAssessmentRepository;
        private final DecisionPassportRepository decisionPassportRepository;

        public MetricsController(RiskAssessmentRepository riskAssessmentRepository,
                                                         DecisionPassportRepository decisionPassportRepository) {
        this.riskAssessmentRepository = riskAssessmentRepository;
                this.decisionPassportRepository = decisionPassportRepository;
    }

    @GetMapping("/dashboard")
    public MetricsResponse getDashboardMetrics() {
        List<RiskAssessment> assessments = riskAssessmentRepository.findAll();

        long total = assessments.size();
        long allowed = decisionPassportRepository.findAll().stream()
                .filter(p -> "PASS".equalsIgnoreCase(p.getDecision()) || "ALLOW".equalsIgnoreCase(p.getDecision()) || "APPROVE".equalsIgnoreCase(p.getDecision()))
                .count();
        long modify = decisionPassportRepository.findAll().stream()
                .filter(p -> "MODIFY".equalsIgnoreCase(p.getDecision()))
                .count();
        long review = decisionPassportRepository.findAll().stream()
                .filter(p -> "WARN".equalsIgnoreCase(p.getDecision()) || "ESCALATE".equalsIgnoreCase(p.getDecision()) || "HUMAN_REVIEW".equalsIgnoreCase(p.getDecision()))
                .count();
        long blocked = decisionPassportRepository.findAll().stream()
                .filter(p -> "BLOCK".equalsIgnoreCase(p.getDecision()))
                .count();

        double avgRisk = assessments.stream()
                .filter(a -> a.getOverallRiskScore() != null)
                .mapToDouble(a -> a.getOverallRiskScore())
                .average()
                .orElse(0.0);

        long highRisk = assessments.stream()
                .filter(a -> a.getOverallRiskScore() != null && a.getOverallRiskScore() > 70)
                .count();

        long mediumRisk = assessments.stream()
                .filter(a -> a.getOverallRiskScore() != null && a.getOverallRiskScore() > 30 && a.getOverallRiskScore() <= 70)
                .count();

        long lowRisk = assessments.stream()
                .filter(a -> a.getOverallRiskScore() != null && a.getOverallRiskScore() <= 30)
                .count();

        return new MetricsResponse(
                total,
                allowed,
                modify,
                review,
                blocked,
                avgRisk,
                highRisk,
                mediumRisk,
                lowRisk
        );
    }
}
