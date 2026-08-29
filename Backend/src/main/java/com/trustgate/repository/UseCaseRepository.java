package com.trustgate.repository;

import com.trustgate.model.UseCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UseCaseRepository extends JpaRepository<UseCase, Long> {
    Optional<UseCase> findByUseCaseId(String useCaseId);
    Optional<UseCase> findByName(String name);
    List<UseCase> findByStatus(String status);
}
