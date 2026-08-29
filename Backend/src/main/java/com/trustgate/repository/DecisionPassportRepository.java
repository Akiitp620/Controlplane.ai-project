package com.trustgate.repository;

import com.trustgate.model.DecisionPassport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DecisionPassportRepository extends JpaRepository<DecisionPassport, Long> {

	java.util.Optional<DecisionPassport> findByRiskAssessmentId(Long riskAssessmentId);
}
