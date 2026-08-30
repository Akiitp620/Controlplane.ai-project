package com.trustgate.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class ConsequenceEngine {

    /*
     * =============================================================
     * CONSEQUENCE SIGNALS
     * =============================================================
     *
     * These signals indicate that an AI response could influence
     * a materially consequential decision or action.
     */

    private static final Set<String> HIGH_CONSEQUENCE_TERMS = Set.of(
            "freeze account",
            "close account",
            "suspend account",
            "terminate",
            "fire employee",
            "fire",
            "reject loan",
            "approve loan",
            "deny loan",
            "credit limit",
            "fraud",
            "criminal",
            "medical diagnosis",
            "medical treatment",
            "medication",
            "prescription",
            "patient",
            "legal",
            "lawsuit",
            "compliance violation",
            "regulatory",
            "employment decision",
            "admission decision"
    );

    /*
     * These are actions where an incorrect AI decision can directly
     * cause significant financial, security, or access consequences.
     */
    private static final Set<String> CRITICAL_ACTION_TERMS = Set.of(
            "delete account",
            "delete customer",
            "transfer money",
            "wire transfer",
            "execute payment",
            "send payment",
            "change bank account",
            "change beneficiary",
            "disable security",
            "disable mfa",
            "disable 2fa",
            "grant admin access",
            "give admin access",
            "reset privileged credentials"
    );

    /*
     * Application-level baseline.
     *
     * IMPORTANT:
     * These values are intentionally below the HIGH/CRITICAL
     * thresholds. Application context raises scrutiny, but does
     * not automatically make every request high consequence.
     */
    private static final int HEALTHCARE_BASELINE = 65;
    private static final int BANKING_BASELINE = 60;
    private static final int HR_BASELINE = 60;
    private static final int DECISION_SUPPORT_BASELINE = 55;
    private static final int EDUCATION_BASELINE = 45;
    private static final int CUSTOMER_SUPPORT_BASELINE = 30;
    private static final int MARKETING_BASELINE = 20;
    private static final int DEFAULT_BASELINE = 40;

    public ConsequenceResult analyze(
            String applicationType,
            String userRequest,
            String aiResponse
    ) {

        String normalizedApplication =
                normalize(applicationType);

        String text =
                normalize(
                        (userRequest == null ? "" : userRequest)
                                + " "
                                + (aiResponse == null ? "" : aiResponse)
                );

        int score =
                baseScore(normalizedApplication);

        String reason =
                baseReason(normalizedApplication);

        String matchedSignal = null;

        /*
         * =========================================================
         * CRITICAL ACTION CHECK
         * =========================================================
         *
         * Critical actions always override the application baseline.
         */
        matchedSignal =
                findMatchingTerm(
                        text,
                        CRITICAL_ACTION_TERMS
                );

        if (matchedSignal != null) {

            score = Math.max(score, 95);

            reason =
                    "Critical action signal detected: "
                            + matchedSignal
                            + ".";
        }

        /*
         * =========================================================
         * HIGH CONSEQUENCE CHECK
         * =========================================================
         */
        if (matchedSignal == null) {

            matchedSignal =
                    findMatchingTerm(
                            text,
                            HIGH_CONSEQUENCE_TERMS
                    );

            if (matchedSignal != null) {

                score = Math.max(score, 85);

                reason =
                        "High-consequence signal detected: "
                                + matchedSignal
                                + ".";
            }
        }

        ConsequenceLevel level =
                toLevel(score);

        return new ConsequenceResult(
                level,
                score,
                reason,
                matchedSignal
        );
    }

    /*
     * =============================================================
     * APPLICATION BASELINE
     * =============================================================
     */
    private int baseScore(String applicationType) {

        if (applicationType == null
                || applicationType.isBlank()) {

            return DEFAULT_BASELINE;
        }

        return switch (applicationType) {

            case "healthcare" ->
                    HEALTHCARE_BASELINE;

            case "banking" ->
                    BANKING_BASELINE;

            case "hr" ->
                    HR_BASELINE;

            case "decision_support" ->
                    DECISION_SUPPORT_BASELINE;

            case "education" ->
                    EDUCATION_BASELINE;

            case "customer_support" ->
                    CUSTOMER_SUPPORT_BASELINE;

            case "marketing" ->
                    MARKETING_BASELINE;

            default ->
                    DEFAULT_BASELINE;
        };
    }

    /*
     * =============================================================
     * BASELINE REASON
     * =============================================================
     */
    private String baseReason(String applicationType) {

        if (applicationType == null
                || applicationType.isBlank()) {

            return "No specific application context was provided.";
        }

        return switch (applicationType) {

            case "healthcare" ->
                    "Healthcare workflows can influence patient outcomes.";

            case "banking" ->
                    "Banking workflows can create financial consequences.";

            case "hr" ->
                    "HR workflows can affect employment decisions.";

            case "decision_support" ->
                    "Decision-support workflows can influence consequential business decisions.";

            case "education" ->
                    "Education workflows can influence student outcomes.";

            case "customer_support" ->
                    "Customer-support workflows generally have limited direct business consequence.";

            case "marketing" ->
                    "Marketing workflows generally have lower direct consequence.";

            default ->
                    "Consequence determined from the available application context.";
        };
    }

    /*
     * =============================================================
     * TERM MATCHING
     * =============================================================
     *
     * Matching is centralized so the consequence rules remain
     * deterministic and easy to extend.
     */
    private String findMatchingTerm(
            String text,
            Set<String> terms
    ) {

        if (text == null || text.isBlank()) {
            return null;
        }

        return terms.stream()
                .filter(text::contains)
                .findFirst()
                .orElse(null);
    }

    /*
     * =============================================================
     * CONSEQUENCE LEVEL
     * =============================================================
     */
    private ConsequenceLevel toLevel(int score) {

        if (score >= 90) {
            return ConsequenceLevel.CRITICAL;
        }

        if (score >= 70) {
            return ConsequenceLevel.HIGH;
        }

        if (score >= 40) {
            return ConsequenceLevel.MEDIUM;
        }

        return ConsequenceLevel.LOW;
    }

    /*
     * =============================================================
     * NORMALIZATION
     * =============================================================
     */
    private String normalize(String value) {

        return value == null
                ? ""
                : value
                        .toLowerCase(Locale.ROOT)
                        .replaceAll("\\s+", " ")
                        .trim();
    }

    /*
     * =============================================================
     * PUBLIC RESULT MODEL
     * =============================================================
     */
    public enum ConsequenceLevel {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public record ConsequenceResult(
            ConsequenceLevel level,
            int score,
            String reason,
            String matchedSignal
    ) {
    }
}