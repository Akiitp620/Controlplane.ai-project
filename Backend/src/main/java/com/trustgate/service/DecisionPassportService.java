package com.trustgate.service;

import com.trustgate.dto.request.DecisionPassportRequest;
import com.trustgate.dto.response.DecisionPassportResponse;
import com.trustgate.model.AIRequest;
import com.trustgate.model.DecisionPassport;
import com.trustgate.model.RiskAssessment;
import com.trustgate.repository.DecisionPassportRepository;
import com.trustgate.repository.RiskAssessmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DecisionPassportService {

    private final DecisionPassportRepository decisionPassportRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;

    public DecisionPassportService(
            DecisionPassportRepository decisionPassportRepository,
            RiskAssessmentRepository riskAssessmentRepository
    ) {
        this.decisionPassportRepository = decisionPassportRepository;
        this.riskAssessmentRepository = riskAssessmentRepository;
    }

    public DecisionPassportResponse createPassport(
            DecisionPassportRequest request
    ) {

        RiskAssessment riskAssessment =
                riskAssessmentRepository.findById(
                        request.getRiskAssessmentId()
                ).orElseThrow(() ->
                        new RuntimeException("Risk assessment not found"));

        AIRequest aiRequest =
                riskAssessment.getResponse().getRequest();

        DecisionPassport passport = new DecisionPassport();

        passport.setRequest(aiRequest);
        passport.setRiskAssessment(riskAssessment);
        passport.setDecision(request.getDecision());
        passport.setFinalResponse(request.getFinalResponse());
        passport.setReason(request.getReason());
        passport.setHumanReviewRequired(
                request.getHumanReviewRequired() != null
                        ? request.getHumanReviewRequired()
                        : false
        );

        DecisionPassport saved =
                decisionPassportRepository.save(passport);

        return toResponse(saved);
    }

    public List<DecisionPassportResponse> getAllPassports() {

        return decisionPassportRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private DecisionPassportResponse toResponse(
            DecisionPassport passport
    ) {

        return new DecisionPassportResponse(
                passport.getId(),
                passport.getRequest().getId(),
                passport.getRiskAssessment().getId(),
                passport.getDecision(),
                passport.getFinalResponse(),
                passport.getReason(),
                passport.getHumanReviewRequired(),
                passport.getCreatedAt()
        );
    }

    public DecisionPassportResponse getPassportById(Long id) {

        DecisionPassport passport =
                decisionPassportRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Decision passport not found"));

        return toResponse(passport);
    }
}