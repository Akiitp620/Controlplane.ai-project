package com.trustgate.service;

import com.trustgate.model.Document;
import com.trustgate.model.DocumentChunk;
import com.trustgate.repository.DocumentChunkRepository;
import com.trustgate.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentChunkService {

    private final DocumentChunkRepository documentChunkRepository;
    private final DocumentRepository documentRepository;

    public DocumentChunkService(
            DocumentChunkRepository documentChunkRepository,
            DocumentRepository documentRepository
    ) {
        this.documentChunkRepository = documentChunkRepository;
        this.documentRepository = documentRepository;
    }

    public DocumentChunk addChunk(
            Long documentId,
            Integer chunkIndex,
            String content
    ) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        DocumentChunk chunk = new DocumentChunk();
        chunk.setDocument(document);
        chunk.setChunkIndex(chunkIndex);
        chunk.setContent(content);

        return documentChunkRepository.save(chunk);
    }

    public List<DocumentChunk> getChunks(Long documentId) {
        return documentChunkRepository.findByDocumentId(documentId);
    }
}