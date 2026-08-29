package com.trustgate.controller;

import com.trustgate.model.Application;
import com.trustgate.repository.ApplicationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;

    public ApplicationController(
            ApplicationRepository applicationRepository
    ) {
        this.applicationRepository = applicationRepository;
    }

    @PostMapping
    public Application createApplication(
            @RequestBody Application application
    ) {
        return applicationRepository.save(application);
    }

    @GetMapping
    public List<Application> getApplications() {
        return applicationRepository.findAll();
    }

    @GetMapping("/{id}")
    public Application getApplication(
            @PathVariable Long id
    ) {
        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));
    }

    @PutMapping("/{id}")
    public Application updateApplication(
            @PathVariable Long id,
            @RequestBody Application updatedApplication
    ) {
        Application application =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        application.setName(updatedApplication.getName());
        application.setType(updatedApplication.getType());
        application.setDescription(updatedApplication.getDescription());
        application.setActive(updatedApplication.isActive());

        return applicationRepository.save(application);
    }
}