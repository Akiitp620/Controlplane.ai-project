package com.trustgate.controller;

import com.trustgate.model.DocumentChunk;
import com.trustgate.service.DocumentChunkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentChunkController {

    private final DocumentChunkService documentChunkService;

    public DocumentChunkController(DocumentChunkService documentChunkService) {
        this.documentChunkService = documentChunkService;
    }

    @PostMapping("/{documentId}/chunks")
    public DocumentChunk addChunk(
            @PathVariable Long documentId,
            @RequestParam Integer chunkIndex,
            @RequestBody String content
    ) {
        return documentChunkService.addChunk(
                documentId,
                chunkIndex,
                content
        );
    }

    @GetMapping("/{documentId}/chunks")
    public List<DocumentChunk> getChunks(
            @PathVariable Long documentId
    ) {
        return documentChunkService.getChunks(documentId);
    }
}