package com.trustgate.repository;

import com.trustgate.model.RiskProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RiskProfileRepository extends JpaRepository<RiskProfile, Long> {

    Optional<RiskProfile> findByApplicationId(Long applicationId);
}