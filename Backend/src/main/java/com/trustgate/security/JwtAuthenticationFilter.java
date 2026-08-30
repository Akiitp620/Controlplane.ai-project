package com.trustgate.security;

import com.trustgate.model.User;
import com.trustgate.repository.UserRepository;
import com.trustgate.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("JWT FILTER: " + request.getRequestURI());

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("JWT FILTER: No Bearer token");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            if (!jwtService.isValid(token)) {
                System.out.println("JWT FILTER: Token is invalid");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid or expired JWT token");
                return;
            }

            String email = jwtService.extractEmail(token);

            System.out.println("JWT FILTER: Email = " + email);

            User user = userRepository.findByEmail(email)
                    .orElse(null);

            if (user == null) {
                System.out.println("JWT FILTER: User not found");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("JWT user not found");
                return;
            }

            if (!Boolean.TRUE.equals(user.getActive())) {
                System.out.println("JWT FILTER: User is inactive");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("User is inactive");
                return;
            }

            String role = user.getRole() == null
                    ? "USER"
                    : user.getRole().toUpperCase();

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + role
                                    )
                            )
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            System.out.println(
                    "JWT FILTER: Authentication successful, role = ROLE_" + role
            );

        } catch (Exception e) {

            System.out.println(
                    "JWT FILTER ERROR: " + e.getClass().getSimpleName()
                            + " - " + e.getMessage()
            );

            // Invalid/expired token: reject with 401 instead of
            // silently continuing as anonymous.
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or expired JWT token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}