package com.trustgate.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "evidence")
@Getter
@Setter
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "risk_assessment_id", nullable = false)
    private RiskAssessment riskAssessment;

    @ManyToOne
    @JoinColumn(name = "document_chunk_id", nullable = false)
    private DocumentChunk documentChunk;

    private Double similarityScore;

    private String verificationResult;

    @Column(columnDefinition = "TEXT")
    private String explanation;
}
