package com.trustgate.service;

import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RiskEngine {

    public RiskResult analyze(
            String userRequest,
            String aiResponse,
            ContextEngine.ContextResult context,
            List<Document> evidence
    ) {

        int hallucination = detectHallucination(
                userRequest,
                aiResponse,
                evidence
        );

        int privacy = detectPrivacy(aiResponse);
        int bias = detectBias(aiResponse);
        int confidence = detectConfidence(aiResponse);

        int overall = calculateOverall(
                hallucination,
                privacy,
                bias,
                confidence,
                context.contextRisk()
        );

        return new RiskResult(
                hallucination,
                privacy,
                bias,
                confidence,
                context.contextRisk(),
                overall
        );
    }

    private int detectHallucination(
            String request,
            String response,
            List<Document> evidence
    ) {

        if (response == null || response.isBlank()) {
            return 100;
        }

        if (evidence == null || evidence.isEmpty()) {
            return 70;
        }

        String responseText = response.toLowerCase();

        if (containsContradictoryRefundWindow(responseText, evidence)) {
            return 100;
        }

        boolean supported = evidence.stream()
                .anyMatch(document ->
                        containsRelevantContent(
                                responseText,
                                document.getText()
                        )
                );

        return supported ? 15 : 60;
    }

    private boolean containsContradictoryRefundWindow(
            String response,
            List<Document> evidence
    ) {
        boolean refundClaim = response.contains("refund") && response.matches(".*\\b\\d+\\s*days?\\b.*");
        boolean longerWindow = evidence.stream().anyMatch(document ->
                document.getText() != null
                        && document.getText().toLowerCase().contains("refund")
                        && document.getText().matches(".*\\b(7|14)\\s*(to|-)?\\s*(7|14)?\\s*business days?\\b.*"));
        return refundClaim && longerWindow;
    }

    private boolean containsRelevantContent(
            String response,
            String evidence
    ) {

        if (evidence == null || evidence.isBlank()) {
            return false;
        }

        String[] words = evidence
                .toLowerCase()
                .replaceAll("[^a-z0-9 ]", " ")
                .split("\\s+");

        int matches = 0;

        for (String word : words) {

            if (word.length() > 4 && response.contains(word)) {
                matches++;
            }

            if (matches >= 2) {
                return true;
            }
        }

        return false;
    }

    private int detectPrivacy(String response) {

        if (response == null) {
            return 0;
        }

        String text = response.toLowerCase();

        if (text.contains("password")
                || text.contains("credit card")
                || text.contains("account number")
                || text.contains("aadhaar")) {
            return 90;
        }

        return 10;
    }

    private int detectBias(String response) {

        if (response == null) {
            return 0;
        }

        return 10;
    }

    private int detectConfidence(String response) {

        if (response == null || response.isBlank()) {
            return 90;
        }

        if (response.toLowerCase().contains("definitely")
                || response.toLowerCase().contains("certainly")
                || response.toLowerCase().contains("guaranteed")) {
            return 80;
        }

        return 20;
    }

    private int calculateOverall(
            int hallucination,
            int privacy,
            int bias,
            int confidence,
            int contextRisk
    ) {

        return (hallucination
                + privacy
                + bias
                + confidence
                + contextRisk) / 5;
    }

    public record RiskResult(
            int hallucinationScore,
            int privacyScore,
            int biasScore,
            int confidenceScore,
            int contextRiskScore,
            int overallRiskScore
    ) {
    }
}