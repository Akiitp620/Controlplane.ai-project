package com.trustgate.controller;

import com.trustgate.dto.request.CreateUseCaseRequest;
import com.trustgate.dto.response.UseCaseResponse;
import com.trustgate.model.UseCase;
import com.trustgate.repository.UseCaseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/use-cases")
public class UseCaseController {

    private final UseCaseRepository useCaseRepository;

    public UseCaseController(UseCaseRepository useCaseRepository) {
        this.useCaseRepository = useCaseRepository;
    }

    @PostMapping
    public UseCaseResponse createUseCase(
            @RequestBody CreateUseCaseRequest request
    ) {
        UseCase useCase = new UseCase();
        useCase.setUseCaseId(request.getUseCaseId());
        useCase.setName(request.getName());
        useCase.setDescription(request.getDescription());
        useCase.setRiskTolerance(request.getRiskTolerance());
        useCase.setLatencyBudget(request.getLatencyBudget());
        useCase.setEvidenceRequirement(request.getEvidenceRequirement());
        useCase.setHumanReviewRule(request.getHumanReviewRule());
        useCase.setCommonRisks(request.getCommonRisks());
        useCase.setAllowedAutonomy(request.getAllowedAutonomy());
        useCase.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        UseCase saved = useCaseRepository.save(useCase);
        return toResponse(saved);
    }

    @GetMapping
    public List<UseCaseResponse> getAllUseCases() {
        return useCaseRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UseCaseResponse getUseCaseById(@PathVariable Long id) {
        UseCase useCase = useCaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UseCase not found"));
        return toResponse(useCase);
    }

    @GetMapping("/by-id/{useCaseId}")
    public UseCaseResponse getUseCaseByUseCaseId(@PathVariable String useCaseId) {
        UseCase useCase = useCaseRepository.findByUseCaseId(useCaseId)
                .orElseThrow(() -> new RuntimeException("UseCase not found"));
        return toResponse(useCase);
    }

    @PutMapping("/{id}")
    public UseCaseResponse updateUseCase(
            @PathVariable Long id,
            @RequestBody CreateUseCaseRequest request
    ) {
        UseCase useCase = useCaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UseCase not found"));

        useCase.setUseCaseId(request.getUseCaseId());
        useCase.setName(request.getName());
        useCase.setDescription(request.getDescription());
        useCase.setRiskTolerance(request.getRiskTolerance());
        useCase.setLatencyBudget(request.getLatencyBudget());
        useCase.setEvidenceRequirement(request.getEvidenceRequirement());
        useCase.setHumanReviewRule(request.getHumanReviewRule());
        useCase.setCommonRisks(request.getCommonRisks());
        useCase.setAllowedAutonomy(request.getAllowedAutonomy());
        if (request.getStatus() != null) {
            useCase.setStatus(request.getStatus());
        }

        UseCase saved = useCaseRepository.save(useCase);
        return toResponse(saved);
    }

    @DeleteMapping("/{id}")
    public void deleteUseCase(@PathVariable Long id) {
        useCaseRepository.deleteById(id);
    }

    private UseCaseResponse toResponse(UseCase useCase) {
        return new UseCaseResponse(
                useCase.getId(),
                useCase.getUseCaseId(),
                useCase.getName(),
                useCase.getDescription(),
                useCase.getRiskTolerance(),
                useCase.getLatencyBudget(),
                useCase.getEvidenceRequirement(),
                useCase.getHumanReviewRule(),
                useCase.getCommonRisks(),
                useCase.getAllowedAutonomy(),
                useCase.getStatus(),
                useCase.getCreatedAt(),
                useCase.getUpdatedAt()
        );
    }
}
