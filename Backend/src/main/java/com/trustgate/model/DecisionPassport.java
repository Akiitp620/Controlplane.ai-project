package com.trustgate.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "decision_passports")
@Getter
@Setter
public class DecisionPassport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "request_id", nullable = false, unique = true)
    private AIRequest request;

    @OneToOne
    @JoinColumn(name = "risk_assessment_id", nullable = false, unique = true)
    private RiskAssessment riskAssessment;

    private String decision;

    @Column(columnDefinition = "TEXT")
    private String finalResponse;

    @Column(columnDefinition = "TEXT")
    private String reason;

    private Boolean humanReviewRequired = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}