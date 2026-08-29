package com.trustgate.service;

import com.trustgate.model.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DocumentVectorService {

    private final VectorStore vectorStore;

    public DocumentVectorService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void indexDocument(Document document) {

        String content = document.getDescription();

        if (content == null || content.isBlank()) {
            return;
        }

        org.springframework.ai.document.Document aiDocument =
                new org.springframework.ai.document.Document(
                        content,
                        Map.of(
                                "documentId", document.getId(),
                                "applicationId", document.getApplication().getId(),
                                "name", document.getName(),
                                "documentType", document.getDocumentType() != null
                                        ? document.getDocumentType()
                                        : ""
                        )
                );

        vectorStore.add(List.of(aiDocument));
    }
}