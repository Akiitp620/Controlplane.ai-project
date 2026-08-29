package com.trustgate.repository;

import com.trustgate.model.AIRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AIRequestRepository extends JpaRepository<AIRequest, Long> {
}
