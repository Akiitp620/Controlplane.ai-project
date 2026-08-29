package com.trustgate.service;

import com.trustgate.model.Application;
import com.trustgate.model.Document;
import com.trustgate.repository.ApplicationRepository;
import com.trustgate.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ApplicationRepository applicationRepository;
    private final DocumentVectorService documentVectorService;

    public DocumentService(
            DocumentRepository documentRepository,
            ApplicationRepository applicationRepository,
            DocumentVectorService documentVectorService
    ) {
        this.documentRepository = documentRepository;
        this.applicationRepository = applicationRepository;
        this.documentVectorService = documentVectorService;
    }

    public Document addDocument(
            Long applicationId,
            String name,
            String documentType,
            String description,
            String source
    ) {

        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));

        Document document = new Document();

        document.setApplication(application);
        document.setName(name);
        document.setDocumentType(documentType);
        document.setDescription(description);
        document.setSource(source);

        Document savedDocument = documentRepository.save(document);

        try {
            documentVectorService.indexDocument(savedDocument);
        } catch (RuntimeException ignored) {
            // Keep the document available for later indexing or lexical fallback.
        }

        return savedDocument;
    }

    public List<Document> getDocuments() {
        return documentRepository.findAll();
    }
}