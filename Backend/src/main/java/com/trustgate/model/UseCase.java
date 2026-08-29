package com.trustgate.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "use_cases")
@Getter
@Setter
public class UseCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String useCaseId;

    private String name;

    private String description;

    private String riskTolerance;

    private String latencyBudget;

    private String evidenceRequirement;

    private String humanReviewRule;

    private String commonRisks;

    private String allowedAutonomy;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
