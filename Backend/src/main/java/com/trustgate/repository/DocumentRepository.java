package com.trustgate.repository;

import com.trustgate.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long>{
}
