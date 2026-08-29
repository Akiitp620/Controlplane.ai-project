package com.trustgate.service;

import com.trustgate.dto.request.HumanReviewRequest;
import com.trustgate.dto.response.HumanReviewResponse;
import com.trustgate.model.HumanReview;
import com.trustgate.model.RiskAssessment;
import com.trustgate.model.User;
import com.trustgate.repository.HumanReviewRepository;
import com.trustgate.repository.RiskAssessmentRepository;
import com.trustgate.repository.UserRepository;
import com.trustgate.repository.DecisionPassportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HumanReviewService {

    private final HumanReviewRepository humanReviewRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final UserRepository userRepository;
        private final DecisionPassportRepository decisionPassportRepository;

    public HumanReviewService(
            HumanReviewRepository humanReviewRepository,
            RiskAssessmentRepository riskAssessmentRepository,
            UserRepository userRepository,
            DecisionPassportRepository decisionPassportRepository
    ) {
        this.humanReviewRepository = humanReviewRepository;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.userRepository = userRepository;
        this.decisionPassportRepository = decisionPassportRepository;
    }

    public HumanReviewResponse createReview(HumanReviewRequest request) {

        RiskAssessment riskAssessment =
                riskAssessmentRepository.findById(request.getRiskAssessmentId())
                        .orElseThrow(() ->
                                new RuntimeException("Risk assessment not found"));

        if (humanReviewRepository
                .findByRiskAssessmentId(request.getRiskAssessmentId())
                .isPresent()) {
            throw new RuntimeException("Human review already exists");
        }

        User reviewer = null;

        if (request.getReviewerId() != null) {
            reviewer = userRepository.findById(request.getReviewerId())
                    .orElseThrow(() ->
                            new RuntimeException("Reviewer not found"));
        }

        HumanReview review = new HumanReview();

        review.setRiskAssessment(riskAssessment);
        review.setReviewer(reviewer);
        review.setDecision(request.getDecision());
        review.setModifiedResponse(request.getModifiedResponse());
        review.setComments(request.getComments());

        String status = request.getStatus();

        if (status == null || status.isBlank()) {
            status = "PENDING";
        }

        review.setStatus(status);

        if ("REVIEWED".equalsIgnoreCase(status)
                || "COMPLETED".equalsIgnoreCase(status)) {
            review.setReviewedAt(LocalDateTime.now());
        }

        HumanReview savedReview =
                humanReviewRepository.save(review);

        return toResponse(savedReview);
    }

        public HumanReviewResponse approveReview(Long id, String comments) {

        HumanReview review = humanReviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Human review not found"));

        review.setDecision("APPROVE");
        review.setStatus("REVIEWED");
        review.setReviewedAt(LocalDateTime.now());
        review.setComments(comments != null ? comments : review.getComments());
        updatePassport(review, "PASS", review.getRiskAssessment().getResponse().getContent());

        HumanReview savedReview = humanReviewRepository.save(review);

        return toResponse(savedReview);
    }

        public HumanReviewResponse rejectReview(Long id, String comments) {

        HumanReview review = humanReviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Human review not found"));

        review.setDecision("REJECT");
        review.setStatus("REVIEWED");
        review.setReviewedAt(LocalDateTime.now());
        review.setComments(comments != null ? comments : review.getComments());
        updatePassport(review, "BLOCK", "Response rejected by human reviewer.");

        HumanReview savedReview = humanReviewRepository.save(review);

        return toResponse(savedReview);
    }

    public HumanReviewResponse modifyReview(
            Long id,
            HumanReviewRequest request
    ) {

        HumanReview review = humanReviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Human review not found"));

        review.setDecision("MODIFY");
        review.setModifiedResponse(request.getModifiedResponse());
        review.setComments(request.getComments());
        review.setStatus("REVIEWED");
        review.setReviewedAt(LocalDateTime.now());
        updatePassport(review, "MODIFY", request.getModifiedResponse());

        HumanReview savedReview = humanReviewRepository.save(review);

        return toResponse(savedReview);
    }

        private void updatePassport(HumanReview review, String decision, String finalResponse) {
                decisionPassportRepository.findByRiskAssessmentId(review.getRiskAssessment().getId())
                                .ifPresent(passport -> {
                                        passport.setDecision(decision);
                                        passport.setFinalResponse(finalResponse);
                                        passport.setHumanReviewRequired(false);
                                        decisionPassportRepository.save(passport);
                                });
        }

    public List<HumanReviewResponse> getAllReviews() {

        return humanReviewRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private HumanReviewResponse toResponse(HumanReview review) {

        Long reviewerId = review.getReviewer() != null
                ? review.getReviewer().getId()
                : null;

        return new HumanReviewResponse(
                review.getId(),
                review.getRiskAssessment().getId(),
                reviewerId,
                review.getDecision(),
                review.getModifiedResponse(),
                review.getComments(),
                review.getStatus(),
                review.getCreatedAt(),
                review.getReviewedAt()
        );
    }
}