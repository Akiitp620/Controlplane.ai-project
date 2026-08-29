package com.trustgate.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;


@Getter
@AllArgsConstructor
public class AnalyzeResponse {

    private String applicationType;
    private String riskTolerance;
    private int hallucinationScore;
    private int privacyScore;
    private int biasScore;
    private int confidenceScore;
    private int contextRiskScore;
    private int overallRiskScore;

    private String decision;
    private String finalResponse;
    private String reason;
    private Long assessmentId;
    private Long passportId;
    private List<String> evidence;
}
