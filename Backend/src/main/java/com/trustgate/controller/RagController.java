package com.trustgate.controller;

import com.trustgate.service.RagService;
import org.springframework.ai.document.Document;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/evidence")
public class RagController {

    private final RagService ragService;

    public RagController(RagService ragService) {
        this.ragService = ragService;
    }

    @PostMapping("/index/{documentId}")
    public String indexDocument(@PathVariable Long documentId) {

        ragService.indexDocument(documentId);

        return "Document indexed successfully";
    }

    @GetMapping("/search")
    public List<String> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int topK
    ) {

        return ragService.search(query, topK)
                .stream()
                .map(Document::getText)
                .collect(Collectors.toList());
    }
}