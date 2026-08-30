package com.trustgate.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "risk_profiles")
@Getter
@Setter
public class RiskProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @Column(name = "risk_tolerance", nullable = false)
    private String riskTolerance;

    @Column(name = "hallucination_threshold")
    private Integer hallucinationThreshold = 60;

    @Column(name = "privacy_threshold")
    private Integer privacyThreshold = 40;

    @Column(name = "bias_threshold")
    private Integer biasThreshold = 60;

    @Column(name = "confidence_threshold")
    private Integer confidenceThreshold = 50;

    @Column(name = "auto_modify_enabled")
    private boolean autoModifyEnabled = true;

    @Column(name = "human_review_required")
    private boolean humanReviewRequired = false;
}
