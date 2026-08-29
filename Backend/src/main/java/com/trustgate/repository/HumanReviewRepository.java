package com.trustgate.repository;

import com.trustgate.model.HumanReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HumanReviewRepository extends JpaRepository<HumanReview, Long> {

    Optional<HumanReview> findByRiskAssessmentId(Long riskAssessmentId);
}