package com.trustgate.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_responses")
@Getter
@Setter
public class AIResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "request_id", nullable = false, unique = true)
    private AIRequest request;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "model_name")
    private String modelName;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}