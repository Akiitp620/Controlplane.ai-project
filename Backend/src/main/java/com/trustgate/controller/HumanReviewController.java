package com.trustgate.controller;

import com.trustgate.dto.request.HumanReviewRequest;
import com.trustgate.dto.response.HumanReviewResponse;
import com.trustgate.service.HumanReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/human-reviews")
public class HumanReviewController {

    private final HumanReviewService humanReviewService;

    public HumanReviewController(
            HumanReviewService humanReviewService
    ) {
        this.humanReviewService = humanReviewService;
    }

    @PostMapping
    public HumanReviewResponse createReview(
            @RequestBody HumanReviewRequest request
    ) {
        return humanReviewService.createReview(request);
    }

    @GetMapping
    public List<HumanReviewResponse> getAllReviews() {
        return humanReviewService.getAllReviews();
    }

    @PostMapping("/{id}/approve")
    public HumanReviewResponse approveReview(
            @PathVariable Long id,
            @RequestBody(required = false) HumanReviewRequest request
    ) {
        return humanReviewService.approveReview(id, request != null ? request.getComments() : null);
    }

    @PostMapping("/{id}/reject")
    public HumanReviewResponse rejectReview(
            @PathVariable Long id,
            @RequestBody(required = false) HumanReviewRequest request
    ) {
        return humanReviewService.rejectReview(id, request != null ? request.getComments() : null);
    }

    @PostMapping("/{id}/modify")
    public HumanReviewResponse modifyReview(
            @PathVariable Long id,
            @RequestBody HumanReviewRequest request
    ) {
        return humanReviewService.modifyReview(id, request);
    }
}