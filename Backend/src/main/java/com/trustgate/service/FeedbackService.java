package com.trustgate.service;

import com.trustgate.dto.request.FeedbackRequest;
import com.trustgate.dto.response.FeedbackResponse;
import com.trustgate.model.DecisionPassport;
import com.trustgate.model.Feedback;
import com.trustgate.repository.DecisionPassportRepository;
import com.trustgate.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final DecisionPassportRepository decisionPassportRepository;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            DecisionPassportRepository decisionPassportRepository
    ) {
        this.feedbackRepository = feedbackRepository;
        this.decisionPassportRepository = decisionPassportRepository;
    }

    public FeedbackResponse createFeedback(FeedbackRequest request) {

        DecisionPassport decisionPassport =
                decisionPassportRepository.findById(
                        request.getDecisionPassportId()
                ).orElseThrow(() ->
                        new RuntimeException("Decision passport not found"));

        Feedback feedback = new Feedback();

        feedback.setDecisionPassport(decisionPassport);
        feedback.setActualDecision(request.getActualDecision());
        feedback.setRating(request.getRating());
        feedback.setComments(request.getComments());

        Feedback savedFeedback =
                feedbackRepository.save(feedback);

        return toResponse(savedFeedback);
    }

    public List<FeedbackResponse> getAllFeedback() {

        return feedbackRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private FeedbackResponse toResponse(Feedback feedback) {

        return new FeedbackResponse(
                feedback.getId(),
                feedback.getDecisionPassport().getId(),
                feedback.getActualDecision(),
                feedback.getRating(),
                feedback.getComments(),
                feedback.getCreatedAt()
        );
    }
}