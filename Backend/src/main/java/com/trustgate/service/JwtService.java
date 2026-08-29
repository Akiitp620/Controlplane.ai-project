package com.trustgate.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(String email, String role) {

        Date now = new Date();
        Date expiry = new Date(now.getTime() + 86400000);

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isValid(String token) {
        try {
            Claims claims = extractClaims(token);

            System.out.println("JWT VALIDATION SUCCESS");
            System.out.println("JWT EMAIL: " + claims.getSubject());
            System.out.println("JWT EXPIRATION: " + claims.getExpiration());

            return claims.getExpiration().after(new Date());

        } catch (Exception e) {
            System.out.println("JWT VALIDATION FAILED");
            System.out.println(
                    "JWT ERROR: "
                            + e.getClass().getSimpleName()
                            + " - "
                            + e.getMessage()
            );

            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}