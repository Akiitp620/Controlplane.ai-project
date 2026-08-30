package com.trustgate.service;

import com.trustgate.model.Document;
import com.trustgate.model.DocumentChunk;
import com.trustgate.repository.DocumentChunkRepository;
import com.trustgate.repository.DocumentRepository;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RagService {

    private final DocumentRepository documentRepository;
    private final DocumentChunkRepository documentChunkRepository;
    private final VectorStore vectorStore;

    public RagService(
            DocumentRepository documentRepository,
            DocumentChunkRepository documentChunkRepository,
            VectorStore vectorStore
    ) {
        this.documentRepository = documentRepository;
        this.documentChunkRepository = documentChunkRepository;
        this.vectorStore = vectorStore;
    }

    public void indexDocument(Long documentId) {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        String content =
                "Document: " + document.getName() +
                        "\nType: " + document.getDocumentType() +
                        "\nDescription: " + document.getDescription() +
                        "\nSource: " + document.getSource();

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("documentId", document.getId());
        metadata.put("documentName", document.getName());
        metadata.put("documentType", document.getDocumentType());
        metadata.put("applicationId", document.getApplication().getId());

        org.springframework.ai.document.Document aiDocument =
                new org.springframework.ai.document.Document(content, metadata);

        TokenTextSplitter splitter = TokenTextSplitter.builder()
                .withChunkSize(500)
                .withMinChunkSizeChars(100)
                .withMinChunkLengthToEmbed(20)
                .build();

        List<org.springframework.ai.document.Document> chunks =
                splitter.apply(List.of(aiDocument));

        List<DocumentChunk> databaseChunks = new ArrayList<>();

        for (int i = 0; i < chunks.size(); i++) {

            org.springframework.ai.document.Document chunk = chunks.get(i);

            DocumentChunk documentChunk = new DocumentChunk();

            documentChunk.setDocument(document);
            documentChunk.setChunkIndex(i);
            documentChunk.setContent(chunk.getText());

            databaseChunks.add(documentChunk);
        }

        documentChunkRepository.saveAll(databaseChunks);

        vectorStore.add(chunks);
    }

    public List<org.springframework.ai.document.Document> search(
            String query,
            int topK
    ) {
        try {
            SearchRequest request = SearchRequest.builder()
                    .query(query)
                    .topK(topK)
                    .similarityThreshold(0.3)
                    .build();

            return vectorStore.similaritySearch(request);
        } catch (RuntimeException e) {
            System.out.println(
                    "RAG SEARCH FALLBACK: vector search failed ("
                            + e.getClass().getSimpleName()
                            + " - " + e.getMessage()
                            + "). Using lexical fallback."
            );
            return documentRepository.findAll().stream()
                    .filter(document -> document.getDescription() != null)
                    .filter(document -> containsQueryTerms(query, document.getDescription()))
                    .limit(topK)
                    .map(document -> new org.springframework.ai.document.Document(
                            document.getDescription(),
                            Map.of(
                                    "documentId", document.getId(),
                                    "applicationId", document.getApplication().getId(),
                                    "documentName", document.getName(),
                                    "documentType", document.getDocumentType() != null ? document.getDocumentType() : ""
                            )))
                    .toList();
        }
    }

    private boolean containsQueryTerms(String query, String content) {
        String normalizedQuery = query.toLowerCase();
        String normalizedContent = content.toLowerCase();
        return normalizedQuery.contains("refund") && normalizedContent.contains("refund")
                || normalizedQuery.contains("payment") && normalizedContent.contains("payment")
                || normalizedQuery.contains("account") && normalizedContent.contains("account")
                || normalizedQuery.contains("policy") && normalizedContent.contains("policy");
    }

    public String generateAnswer(String query, int topK) {

        List<org.springframework.ai.document.Document> documents =
                search(query, topK);

        if (documents.isEmpty()) {
            return "I could not find relevant information in the provided documents.";
        }

        String context = documents.stream()
                .map(org.springframework.ai.document.Document::getText)
                .reduce("", (a, b) -> a + "\n\n" + b);

        return context;
    }

}