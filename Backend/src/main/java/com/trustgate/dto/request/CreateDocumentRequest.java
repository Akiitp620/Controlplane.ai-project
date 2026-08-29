package com.trustgate.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDocumentRequest {

    private Long applicationId;
    private String name;
    private String documentType;
    private String description;
    private String source;
}