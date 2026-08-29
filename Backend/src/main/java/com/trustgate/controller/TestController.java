package com.trustgate.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {
        return "Trustgate backend is running";
    }

    @GetMapping("/api/health")
    public String health() {
        return "Trustgate backend is healthy";
    }
}