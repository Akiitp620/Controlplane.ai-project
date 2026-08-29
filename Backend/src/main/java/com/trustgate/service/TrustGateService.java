package com.trustgate.service;

import com.trustgate.dto.request.AnalyzeRequest;
import com.trustgate.dto.request.DecisionPassportRequest;
import com.trustgate.dto.request.HumanReviewRequest;
import com.trustgate.dto.response.AnalyzeResponse;
import com.trustgate.model.AIRequest;
import com.trustgate.model.AIResponse;
import com.trustgate.model.Application;
import com.trustgate.model.RiskAssessment;
import com.trustgate.model.RiskProfile;
import com.trustgate.repository.AIRequestRepository;
import com.trustgate.repository.AIResponseRepository;
import com.trustgate.repository.ApplicationRepository;
import com.trustgate.repository.RiskAssessmentRepository;
import com.trustgate.repository.RiskProfileRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrustGateService {

    private final ApplicationRepository applicationRepository;
    private final RiskProfileRepository riskProfileRepository;
    private final AIRequestRepository aiRequestRepository;
    private final AIResponseRepository aiResponseRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final ContextEngine contextEngine;
    private final RiskEngine riskEngine;
    private final PolicyEngine policyEngine;
    private final RagService ragService;
    private final ChatClient chatClient;
        private final DecisionPassportService decisionPassportService;
        private final HumanReviewService humanReviewService;

    public TrustGateService(
            ApplicationRepository applicationRepository,
            RiskProfileRepository riskProfileRepository,
            AIRequestRepository aiRequestRepository,
            AIResponseRepository aiResponseRepository,
            RiskAssessmentRepository riskAssessmentRepository,
            ContextEngine contextEngine,
            RiskEngine riskEngine,
            PolicyEngine policyEngine,
            RagService ragService,
            ChatClient.Builder chatClientBuilder,
            DecisionPassportService decisionPassportService,
            HumanReviewService humanReviewService
    ) {
        this.applicationRepository = applicationRepository;
        this.riskProfileRepository = riskProfileRepository;
        this.aiRequestRepository = aiRequestRepository;
        this.aiResponseRepository = aiResponseRepository;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.contextEngine = contextEngine;
        this.riskEngine = riskEngine;
        this.policyEngine = policyEngine;
        this.ragService = ragService;
        this.chatClient = chatClientBuilder.build();
        this.decisionPassportService = decisionPassportService;
        this.humanReviewService = humanReviewService;
    }

    public AnalyzeResponse analyze(AnalyzeRequest request) {

        Application application = applicationRepository
                .findById(request.getApplicationId())
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));

        RiskProfile riskProfile = riskProfileRepository
                .findAll()
                .stream()
                .filter(profile ->
                        profile.getApplication().getId()
                                .equals(application.getId()))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("Risk profile not found"));

        AIRequest aiRequest = new AIRequest();
        aiRequest.setApplication(application);
        aiRequest.setContent(request.getUserRequest());

        AIRequest savedRequest =
                aiRequestRepository.save(aiRequest);

        ContextEngine.ContextResult context =
                contextEngine.analyze(application, riskProfile);

        List<Document> evidence =
                ragService.search(request.getUserRequest(), 5);

        String contextText = evidence.stream()
                .map(Document::getText)
                .reduce("", (a, b) -> a + "\n\n" + b);

        if (contextText.isBlank()) {
            contextText = "No relevant evidence was found.";
        }

        String generatedResponse = request.getAiResponse();

        if (generatedResponse == null || generatedResponse.isBlank()) {
            generatedResponse = chatClient.prompt()
                    .system("""
                            You are a trustworthy AI assistant for a banking application.

                            Answer the user's request using the provided evidence.

                            Rules:
                            - Use the evidence as the primary source of information.
                            - Do not invent facts.
                            - Do not make unsupported promises.
                            - If the evidence does not contain enough information,
                              clearly say that the information is not available.
                            - Keep the response clear and concise.

                            Evidence:
                            %s
                            """.formatted(contextText))
                    .user(request.getUserRequest())
                    .call()
                    .content();
        }

        if (generatedResponse == null || generatedResponse.isBlank()) {
            generatedResponse =
                    "I could not generate a response at this time.";
        }

        AIResponse aiResponse = new AIResponse();
        aiResponse.setRequest(savedRequest);
        aiResponse.setContent(generatedResponse);
        aiResponse.setModelName("gemini-3.5-flash");

        AIResponse savedResponse =
                aiResponseRepository.save(aiResponse);

        RiskEngine.RiskResult risk =
                riskEngine.analyze(
                        request.getUserRequest(),
                        generatedResponse,
                        context,
                        evidence
                );

        PolicyEngine.DecisionResult decision =
                policyEngine.decide(
                        risk,
                        riskProfile.getRiskTolerance()
                );

        RiskAssessment assessment = new RiskAssessment();

        assessment.setResponse(savedResponse);

        assessment.setHallucinationScore(
                risk.hallucinationScore()
        );

        assessment.setPrivacyScore(
                risk.privacyScore()
        );

        assessment.setBiasScore(
                risk.biasScore()
        );

        assessment.setConfidenceScore(
                risk.confidenceScore()
        );

        assessment.setContextRiskScore(
                risk.contextRiskScore()
        );

        assessment.setOverallRiskScore(
                risk.overallRiskScore()
        );

        assessment.setExplanation(
                decision.reason()
        );

        RiskAssessment savedAssessment = riskAssessmentRepository.save(assessment);

        String finalResponse = generatedResponse;

        if ("MODIFY".equals(decision.decision())
                || "ESCALATE".equals(decision.decision())) {

            finalResponse =
                    "This response requires human review before being provided to the user.";
        }

        DecisionPassportRequest passportRequest = new DecisionPassportRequest();
        passportRequest.setRiskAssessmentId(savedAssessment.getId());
        passportRequest.setDecision(decision.decision());
        passportRequest.setFinalResponse(finalResponse);
        passportRequest.setReason(decision.reason());
        passportRequest.setHumanReviewRequired("ESCALATE".equals(decision.decision()));
        decisionPassportService.createPassport(passportRequest);
        Long passportId = decisionPassportService.getAllPassports().stream()
                .filter(passport -> savedAssessment.getId().equals(passport.riskAssessmentId()))
                .map(passport -> passport.id())
                .findFirst()
                .orElse(null);

        if ("ESCALATE".equals(decision.decision())) {
            HumanReviewRequest reviewRequest = new HumanReviewRequest();
            reviewRequest.setRiskAssessmentId(savedAssessment.getId());
            reviewRequest.setDecision(decision.decision());
            reviewRequest.setStatus("PENDING");
            reviewRequest.setComments(decision.reason());
            humanReviewService.createReview(reviewRequest);
        }

        return new AnalyzeResponse(
                context.applicationType(),
                context.riskTolerance(),
                risk.hallucinationScore(),
                risk.privacyScore(),
                risk.biasScore(),
                risk.confidenceScore(),
                risk.contextRiskScore(),
                risk.overallRiskScore(),
                decision.decision(),
                finalResponse,
                decision.reason(),
                savedAssessment.getId(),
                passportId,
                evidence.stream().map(Document::getText).toList()
        );
    }
}