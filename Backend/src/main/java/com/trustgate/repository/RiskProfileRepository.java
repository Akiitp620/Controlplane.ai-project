package com.trustgate.repository;

import com.trustgate.model.RiskProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskProfileRepository extends JpaRepository<RiskProfile, Long> {
}
