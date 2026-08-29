package com.trustgate.controller;

import com.trustgate.dto.request.FeedbackRequest;
import com.trustgate.dto.response.FeedbackResponse;
import com.trustgate.service.FeedbackService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public FeedbackResponse createFeedback(
            @RequestBody FeedbackRequest request
    ) {
        return feedbackService.createFeedback(request);
    }

    @GetMapping
    public List<FeedbackResponse> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }
}