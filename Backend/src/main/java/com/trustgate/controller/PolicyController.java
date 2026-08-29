package com.trustgate.controller;

import com.trustgate.dto.request.CreatePolicyRequest;
import com.trustgate.dto.response.PolicyResponse;
import com.trustgate.model.Policy;
import com.trustgate.repository.PolicyRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final PolicyRepository policyRepository;

    public PolicyController(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    @PostMapping
    public PolicyResponse createPolicy(
            @RequestBody CreatePolicyRequest request
    ) {
        Policy policy = new Policy();
        policy.setName(request.getName());
        policy.setUseCase(request.getUseCase());
        policy.setRiskTolerance(request.getRiskTolerance());
        policy.setEvidenceRequirement(request.getEvidenceRequirement());
        policy.setHumanReviewRequirement(request.getHumanReviewRequirement());
        policy.setDescription(request.getDescription());
        policy.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        policy.setVersion(request.getVersion() != null ? request.getVersion() : 1);

        Policy saved = policyRepository.save(policy);
        return toResponse(saved);
    }

    @GetMapping
    public List<PolicyResponse> getAllPolicies() {
        return policyRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public PolicyResponse getPolicyById(@PathVariable Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));
        return toResponse(policy);
    }

    @PutMapping("/{id}")
    public PolicyResponse updatePolicy(
            @PathVariable Long id,
            @RequestBody CreatePolicyRequest request
    ) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        policy.setName(request.getName());
        policy.setUseCase(request.getUseCase());
        policy.setRiskTolerance(request.getRiskTolerance());
        policy.setEvidenceRequirement(request.getEvidenceRequirement());
        policy.setHumanReviewRequirement(request.getHumanReviewRequirement());
        policy.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            policy.setStatus(request.getStatus());
        }
        if (request.getVersion() != null) {
            policy.setVersion(request.getVersion());
        }

        Policy saved = policyRepository.save(policy);
        return toResponse(saved);
    }

    @DeleteMapping("/{id}")
    public void deletePolicy(@PathVariable Long id) {
        policyRepository.deleteById(id);
    }

    private PolicyResponse toResponse(Policy policy) {
        return new PolicyResponse(
                policy.getId(),
                policy.getName(),
                policy.getUseCase(),
                policy.getRiskTolerance(),
                policy.getEvidenceRequirement(),
                policy.getHumanReviewRequirement(),
                policy.getVersion(),
                policy.getStatus(),
                policy.getDescription(),
                policy.getCreatedAt(),
                policy.getUpdatedAt()
        );
    }
}
