package com.resumeai.resumeanalyzer.config;

import com.resumeai.resumeanalyzer.security.JwtAuthFiller;
import com.resumeai.resumeanalyzer.security.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    // Security configuration can be added here if needed
    // For example, you can configure authentication, authorization, etc.
    // This is a placeholder for future security configurations.

    private final UserDetailsService userDetailsService;
    private final JwtAuthFiller jwtAuthFiller;

    public SecurityConfig(UserDetailsService userDetailsService, JwtAuthFiller jwtAuthFiller) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthFiller = jwtAuthFiller;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFiller, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Use a password encoder for encoding passwords
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // This bean is used to manage authentication
        return config.getAuthenticationManager();
    }


}
