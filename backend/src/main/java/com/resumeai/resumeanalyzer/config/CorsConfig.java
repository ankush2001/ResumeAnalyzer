package com.resumeai.resumeanalyzer.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    private final Logger logger = LoggerFactory.getLogger(CorsConfig.class);

    @Value("${FRONTEND_ORIGIN:https://resumeanalyzer-frontend-latest.onrender.com}")
    private String frontendUrl;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        logger.info("🔥 CORS Frontend Origin = {}", frontendUrl);
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("https://resumeanalyzer-frontend-latest.onrender.com",
                                "http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
