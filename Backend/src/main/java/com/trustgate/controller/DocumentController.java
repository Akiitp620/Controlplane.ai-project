package com.trustgate.controller;

import com.trustgate.dto.request.CreateDocumentRequest;
import com.trustgate.model.Document;
import com.trustgate.service.DocumentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping
    public Document createDocument(
            @RequestBody CreateDocumentRequest request
    ) {
        return documentService.addDocument(
                request.getApplicationId(),
                request.getName(),
                request.getDocumentType(),
                request.getDescription(),
                request.getSource()
        );
    }

    @GetMapping
    public List<Document> getDocuments() {
        return documentService.getDocuments();
    }
}