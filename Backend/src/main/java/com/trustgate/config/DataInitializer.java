package com.trustgate.config;

import com.trustgate.model.Application;
import com.trustgate.model.Document;
import com.trustgate.model.Policy;
import com.trustgate.model.RiskProfile;
import com.trustgate.model.UseCase;
import com.trustgate.model.User;
import com.trustgate.repository.ApplicationRepository;
import com.trustgate.repository.DocumentChunkRepository;
import com.trustgate.repository.DocumentRepository;
import com.trustgate.repository.PolicyRepository;
import com.trustgate.repository.RiskProfileRepository;
import com.trustgate.repository.UseCaseRepository;
import com.trustgate.repository.UserRepository;
import com.trustgate.service.RagService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedDatabase(
            ApplicationRepository applicationRepository,
            RiskProfileRepository riskProfileRepository,
            DocumentRepository documentRepository,
            PolicyRepository policyRepository,
            UseCaseRepository useCaseRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            RagService ragService,
            DocumentChunkRepository documentChunkRepository
    ) {
        return args -> {

            /*
             * =========================================================
             * 1. APPLICATION
             * =========================================================
             *
             * Use the first existing application if one exists.
             * Otherwise create the demo application.
             */
            Application application = applicationRepository
                    .findAll()
                    .stream()
                    .findFirst()
                    .orElseGet(() -> {

                        Application newApplication = new Application();

                        newApplication.setName(
                                "ControlPlane Banking Assistant"
                        );

                        newApplication.setType(
                                "DECISION_SUPPORT"
                        );

                        newApplication.setDescription(
                                "Demo banking AI application used for "
                                        + "responsible AI evaluation."
                        );

                        newApplication.setActive(true);

                        Application savedApplication =
                                applicationRepository.save(newApplication);

                        System.out.println(
                                "DATA INITIALIZER: Created demo application "
                                        + "with ID = "
                                        + savedApplication.getId()
                        );

                        return savedApplication;
                    });

            System.out.println(
                    "DATA INITIALIZER: Using application ID = "
                            + application.getId()
            );

            /*
             * =========================================================
             * 2. RISK PROFILE
             * =========================================================
             */
            boolean riskProfileExists =
                    riskProfileRepository.findAll()
                            .stream()
                            .anyMatch(profile ->
                                    profile.getApplication() != null
                                            && application.getId().equals(
                                            profile.getApplication().getId()
                                    )
                            );

            if (!riskProfileExists) {

                RiskProfile riskProfile = new RiskProfile();

                riskProfile.setApplication(application);
                riskProfile.setRiskTolerance("MEDIUM");

                riskProfile.setHallucinationThreshold(60);
                riskProfile.setPrivacyThreshold(40);
                riskProfile.setBiasThreshold(60);
                riskProfile.setConfidenceThreshold(50);

                riskProfile.setAutoModifyEnabled(true);
                riskProfile.setHumanReviewRequired(false);

                RiskProfile savedRiskProfile =
                        riskProfileRepository.save(riskProfile);

                System.out.println(
                        "DATA INITIALIZER: Created risk profile with ID = "
                                + savedRiskProfile.getId()
                );

            } else {

                System.out.println(
                        "DATA INITIALIZER: Risk profile already exists."
                );
            }

            /*
             * =========================================================
             * 3. DEMO DOCUMENTS
             * =========================================================
             *
             * Documents are stored in PostgreSQL here.
             *
             * After seeding, we attempt to index them into the PGVector
             * store so RAG retrieval works. Indexing is best-effort:
             * if the Gemini API key is missing/invalid, we log a warning
             * and continue — the documents remain available for the
             * lexical fallback in RagService.
             */
            long existingDocuments =
                    documentRepository.findAll()
                            .stream()
                            .filter(document ->
                                    document.getApplication() != null
                                            && application.getId().equals(
                                            document.getApplication().getId()
                                    )
                            )
                            .count();

            if (existingDocuments == 0) {

                Document refundPolicy = new Document();

                refundPolicy.setApplication(application);
                refundPolicy.setName("Refund Policy");
                refundPolicy.setDocumentType("POLICY");
                refundPolicy.setDescription(
                        "Refunds are available for eligible transactions. "
                                + "Approved refund requests are normally "
                                + "processed within 7 business days. "
                                + "Some transactions may require additional "
                                + "verification before a refund is approved."
                );
                refundPolicy.setSource(
                        "ControlPlane Demo Policy"
                );

                documentRepository.save(refundPolicy);


                Document paymentPolicy = new Document();

                paymentPolicy.setApplication(application);
                paymentPolicy.setName("Payment Policy");
                paymentPolicy.setDocumentType("POLICY");
                paymentPolicy.setDescription(
                        "Payment transactions must be verified before "
                                + "approval. High-risk or unusual payment "
                                + "activity may require additional "
                                + "verification or human review."
                );
                paymentPolicy.setSource(
                        "ControlPlane Demo Policy"
                );

                documentRepository.save(paymentPolicy);


                Document privacyPolicy = new Document();

                privacyPolicy.setApplication(application);
                privacyPolicy.setName("Privacy Policy");
                privacyPolicy.setDocumentType("POLICY");
                privacyPolicy.setDescription(
                        "Sensitive customer information must be protected. "
                                + "Passwords, authentication credentials, "
                                + "account numbers and other sensitive "
                                + "information must not be disclosed "
                                + "unnecessarily."
                );
                privacyPolicy.setSource(
                        "ControlPlane Demo Policy"
                );

                documentRepository.save(privacyPolicy);

                System.out.println(
                        "DATA INITIALIZER: Created demo documents."
                );

                /*
                 * Index the newly created documents into PGVector.
                 * Best-effort: failures are logged, not fatal.
                 */
                documentRepository.findAll()
                        .stream()
                        .filter(document ->
                                document.getApplication() != null
                                        && application.getId().equals(
                                        document.getApplication().getId()
                                )
                        )
                        .forEach(document -> {
                            try {
                                ragService.indexDocument(document.getId());
                                System.out.println(
                                        "DATA INITIALIZER: Indexed document "
                                                + document.getId()
                                                + " into vector store."
                                );
                            } catch (RuntimeException e) {
                                System.out.println(
                                        "DATA INITIALIZER: Could not index "
                                                + "document " + document.getId()
                                                + " into vector store: "
                                                + e.getMessage()
                                );
                            }
                        });

            } else {

                System.out.println(
                        "DATA INITIALIZER: Demo documents already exist."
                );
            }

            /*
             * Idempotent indexing: if no chunks exist for the demo
             * documents (e.g. indexing previously failed because the
             * Gemini key was missing), index them now. Best-effort.
             */
            boolean chunksExist =
                    documentRepository.findAll()
                            .stream()
                            .filter(document ->
                                    document.getApplication() != null
                                            && application.getId().equals(
                                            document.getApplication().getId()
                                    )
                            )
                            .anyMatch(document ->
                                    !documentChunkRepository
                                            .findByDocumentId(document.getId())
                                            .isEmpty()
                            );

            if (!chunksExist) {
                documentRepository.findAll()
                        .stream()
                        .filter(document ->
                                document.getApplication() != null
                                        && application.getId().equals(
                                        document.getApplication().getId()
                                )
                        )
                        .forEach(document -> {
                            try {
                                ragService.indexDocument(document.getId());
                                System.out.println(
                                        "DATA INITIALIZER: Indexed document "
                                                + document.getId()
                                                + " into vector store."
                                );
                            } catch (RuntimeException e) {
                                System.out.println(
                                        "DATA INITIALIZER: Could not index "
                                                + "document " + document.getId()
                                                + ": " + e.getMessage()
                                );
                            }
                        });
            }

            /*
             * =========================================================
             * 4. POLICIES
             * =========================================================
             */
            if (policyRepository.count() == 0) {

                Policy customerSupport = new Policy();
                customerSupport.setName("Customer Support Policy");
                customerSupport.setUseCase("customer_support");
                customerSupport.setRiskTolerance("MEDIUM");
                customerSupport.setEvidenceRequirement("RECOMMENDED");
                customerSupport.setHumanReviewRequirement(
                        "High consequence only"
                );
                customerSupport.setDescription(
                        "AI assisting customers with support queries, "
                                + "refunds, and account issues."
                );
                customerSupport.setStatus("ACTIVE");
                customerSupport.setVersion(1);
                policyRepository.save(customerSupport);

                Policy knowledgeAssistant = new Policy();
                knowledgeAssistant.setName("Knowledge Assistant Policy");
                knowledgeAssistant.setUseCase("knowledge_assistant");
                knowledgeAssistant.setRiskTolerance("MEDIUM");
                knowledgeAssistant.setEvidenceRequirement("RECOMMENDED");
                knowledgeAssistant.setHumanReviewRequirement(
                        "Not required for standard queries"
                );
                knowledgeAssistant.setDescription(
                        "AI answering employee questions using internal "
                                + "knowledge base and policy documents."
                );
                knowledgeAssistant.setStatus("ACTIVE");
                knowledgeAssistant.setVersion(1);
                policyRepository.save(knowledgeAssistant);

                Policy decisionSupport = new Policy();
                decisionSupport.setName("Decision Support Policy");
                decisionSupport.setUseCase("decision_support");
                decisionSupport.setRiskTolerance("LOW");
                decisionSupport.setEvidenceRequirement("STRICT");
                decisionSupport.setHumanReviewRequirement(
                        "Required for high consequence decisions"
                );
                decisionSupport.setDescription(
                        "AI recommending decisions on customer eligibility, "
                                + "risk, or fraud assessment."
                );
                decisionSupport.setStatus("ACTIVE");
                decisionSupport.setVersion(1);
                policyRepository.save(decisionSupport);

                Policy agentAction = new Policy();
                agentAction.setName("Agent Action Policy");
                agentAction.setUseCase("agent_action");
                agentAction.setRiskTolerance("LOW");
                agentAction.setEvidenceRequirement("STRICT");
                agentAction.setHumanReviewRequirement(
                        "Required for high-value or irreversible actions"
                );
                agentAction.setDescription(
                        "AI agent proposing or executing autonomous actions "
                                + "such as payments, transfers, or system changes."
                );
                agentAction.setStatus("ACTIVE");
                agentAction.setVersion(1);
                policyRepository.save(agentAction);

                System.out.println(
                        "DATA INITIALIZER: Created demo policies."
                );

            } else {

                System.out.println(
                        "DATA INITIALIZER: Policies already exist."
                );
            }

            /*
             * =========================================================
             * 5. USE CASES
             * =========================================================
             */
            if (useCaseRepository.count() == 0) {

                UseCase customerSupport = new UseCase();
                customerSupport.setUseCaseId("customer_support");
                customerSupport.setName("Customer Support");
                customerSupport.setDescription(
                        "AI assisting customers with support queries, "
                                + "refunds, and account issues."
                );
                customerSupport.setRiskTolerance("MEDIUM");
                customerSupport.setLatencyBudget("VERY_LOW");
                customerSupport.setEvidenceRequirement("RECOMMENDED");
                customerSupport.setHumanReviewRule("High consequence only");
                customerSupport.setCommonRisks(
                        "Hallucinated policy details,Incorrect refund amounts,"
                                + "Privacy exposure of customer data"
                );
                customerSupport.setAllowedAutonomy(
                        "ALLOW,MODIFY,HUMAN_REVIEW,BLOCK"
                );
                customerSupport.setStatus("ACTIVE");
                useCaseRepository.save(customerSupport);

                UseCase knowledgeAssistant = new UseCase();
                knowledgeAssistant.setUseCaseId("knowledge_assistant");
                knowledgeAssistant.setName("Internal Knowledge Assistant");
                knowledgeAssistant.setDescription(
                        "AI answering employee questions using internal "
                                + "knowledge base and policy documents."
                );
                knowledgeAssistant.setRiskTolerance("MEDIUM");
                knowledgeAssistant.setLatencyBudget("LOW");
                knowledgeAssistant.setEvidenceRequirement("RECOMMENDED");
                knowledgeAssistant.setHumanReviewRule(
                        "Not required for standard queries"
                );
                knowledgeAssistant.setCommonRisks(
                        "Contradicted policy claims,Outdated information,"
                                + "Hallucinated benefits"
                );
                knowledgeAssistant.setAllowedAutonomy(
                        "ALLOW,MODIFY,HUMAN_REVIEW,BLOCK"
                );
                knowledgeAssistant.setStatus("ACTIVE");
                useCaseRepository.save(knowledgeAssistant);

                UseCase decisionSupport = new UseCase();
                decisionSupport.setUseCaseId("decision_support");
                decisionSupport.setName("Decision Support");
                decisionSupport.setDescription(
                        "AI recommending decisions on customer eligibility, "
                                + "risk, or fraud assessment."
                );
                decisionSupport.setRiskTolerance("LOW");
                decisionSupport.setLatencyBudget("MEDIUM");
                decisionSupport.setEvidenceRequirement("STRICT");
                decisionSupport.setHumanReviewRule(
                        "Required for high consequence decisions"
                );
                decisionSupport.setCommonRisks(
                        "High-consequence recommendations without evidence,"
                                + "Bias in eligibility decisions,"
                                + "Unverified fraud assertions"
                );
                decisionSupport.setAllowedAutonomy(
                        "ALLOW,MODIFY,HUMAN_REVIEW,BLOCK"
                );
                decisionSupport.setStatus("ACTIVE");
                useCaseRepository.save(decisionSupport);

                UseCase agentAction = new UseCase();
                agentAction.setUseCaseId("agent_action");
                agentAction.setName("AI Agent Action");
                agentAction.setDescription(
                        "AI agent proposing or executing autonomous actions "
                                + "such as payments, transfers, or system changes."
                );
                agentAction.setRiskTolerance("LOW");
                agentAction.setLatencyBudget("HIGH");
                agentAction.setEvidenceRequirement("STRICT");
                agentAction.setHumanReviewRule(
                        "Required for high-value or irreversible actions"
                );
                agentAction.setCommonRisks(
                        "Critical financial actions,Irreversible operations,"
                                + "Insufficient authorization"
                );
                agentAction.setAllowedAutonomy(
                        "ALLOW,MODIFY,HUMAN_REVIEW,BLOCK"
                );
                agentAction.setStatus("ACTIVE");
                useCaseRepository.save(agentAction);

                System.out.println(
                        "DATA INITIALIZER: Created demo use cases."
                );

            } else {

                System.out.println(
                        "DATA INITIALIZER: Use cases already exist."
                );
            }

            /*
             * =========================================================
             * 6. DEMO USER
             * =========================================================
             */
            if (userRepository.findByEmail("admin@controlplane.ai").isEmpty()) {

                User demoUser = new User();
                demoUser.setName("Demo Admin");
                demoUser.setEmail("admin@controlplane.ai");
                demoUser.setPassword(
                        passwordEncoder.encode("admin123")
                );
                demoUser.setRole("ADMIN");
                demoUser.setActive(true);

                userRepository.save(demoUser);

                System.out.println(
                        "DATA INITIALIZER: Created demo user "
                                + "admin@controlplane.ai / admin123"
                );

            } else {

                System.out.println(
                        "DATA INITIALIZER: Demo admin already exists."
                );
            }

            /*
             * =========================================================
             * 7. COMPLETE
             * =========================================================
             */
            System.out.println(
                    "DATA INITIALIZER: Database initialization completed."
            );
        };
    }
}