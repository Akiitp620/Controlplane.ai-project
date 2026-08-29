package com.trustgate.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Entity
@Table(name = "human_reviews")
@Getter
@Setter
public class HumanReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "risk_assessment_id", nullable = false, unique = true)
    private RiskAssessment riskAssessment;

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    private String decision;

    @Column(columnDefinition = "TEXT")
    private String modifiedResponse;

    @Column(columnDefinition = "TEXT")
    private String comments;

    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime reviewedAt;
}
