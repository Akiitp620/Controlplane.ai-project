package com.trustgate.controller;

import com.trustgate.dto.response.MetricsResponse;
import com.trustgate.model.DecisionPassport;
import com.trustgate.model.RiskAssessment;
import com.trustgate.repository.DecisionPassportRepository;
import com.trustgate.repository.RiskAssessmentRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
public class MetricsController {

    private final RiskAssessmentRepository riskAssessmentRepository;
    private final DecisionPassportRepository decisionPassportRepository;

    public MetricsController(
            RiskAssessmentRepository riskAssessmentRepository,
            DecisionPassportRepository decisionPassportRepository
    ) {
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.decisionPassportRepository = decisionPassportRepository;
    }

    @GetMapping("/dashboard")
    public MetricsResponse getDashboardMetrics() {

        /*
         * Fetch each dataset only once.
         *
         * Previous implementation called
         * decisionPassportRepository.findAll()
         * four separate times for four decision counts.
         *
         * Keeping a single in-memory list avoids those
         * repeated database round trips.
         */
        List<RiskAssessment> assessments =
                riskAssessmentRepository.findAll();

        List<DecisionPassport> decisions =
                decisionPassportRepository.findAll();

        long total = assessments.size();

        long allowed = decisions.stream()
                .filter(this::isAllowed)
                .count();

        long modify = decisions.stream()
                .filter(this::isModify)
                .count();

        long review = decisions.stream()
                .filter(this::isReview)
                .count();

        long blocked = decisions.stream()
                .filter(this::isBlocked)
                .count();

        /*
         * overallRiskScore is an Integer in the
         * current RiskAssessment model.
         */
        double avgRisk = assessments.stream()
                .map(RiskAssessment::getOverallRiskScore)
                .filter(score -> score != null)
                .mapToDouble(Integer::doubleValue)
                .average()
                .orElse(0.0);

        long highRisk = assessments.stream()
                .filter(this::hasHighRisk)
                .count();

        long mediumRisk = assessments.stream()
                .filter(this::hasMediumRisk)
                .count();

        long lowRisk = assessments.stream()
                .filter(this::hasLowRisk)
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

    private boolean isAllowed(
            DecisionPassport passport
    ) {
        String decision = passport.getDecision();

        return "PASS".equalsIgnoreCase(decision)
                || "ALLOW".equalsIgnoreCase(decision)
                || "APPROVE".equalsIgnoreCase(decision);
    }

    private boolean isModify(
            DecisionPassport passport
    ) {
        return "MODIFY".equalsIgnoreCase(
                passport.getDecision()
        );
    }

    private boolean isReview(
            DecisionPassport passport
    ) {
        String decision = passport.getDecision();

        return "WARN".equalsIgnoreCase(decision)
                || "ESCALATE".equalsIgnoreCase(decision)
                || "HUMAN_REVIEW".equalsIgnoreCase(decision);
    }

    private boolean isBlocked(
            DecisionPassport passport
    ) {
        return "BLOCK".equalsIgnoreCase(
                passport.getDecision()
        );
    }

    private boolean hasHighRisk(
            RiskAssessment assessment
    ) {
        Integer score =
                assessment.getOverallRiskScore();

        return score != null && score > 70;
    }

    private boolean hasMediumRisk(
            RiskAssessment assessment
    ) {
        Integer score =
                assessment.getOverallRiskScore();

        return score != null
                && score > 30
                && score <= 70;
    }

    private boolean hasLowRisk(
            RiskAssessment assessment
    ) {
        Integer score =
                assessment.getOverallRiskScore();

        return score != null && score <= 30;
    }
}