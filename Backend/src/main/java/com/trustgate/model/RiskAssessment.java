package com.trustgate.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "risk_assessments")
@Getter
@Setter
public class RiskAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "response_id", nullable = false, unique = true)
    private AIResponse response;

    private Integer hallucinationScore;

    private Integer privacyScore;

    private Integer biasScore;

    private Integer confidenceScore;

    private Integer contextRiskScore;

    private Integer overallRiskScore;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}