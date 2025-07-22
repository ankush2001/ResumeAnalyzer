package main.java.com.resumeai.resumeanalyzer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PerplexityAiWebClientService {

    private final WebClient webClient;

    public PerplexityAiWebClientService(
            WebClient.Builder webClientBuilder,
            @Value("${perplexity.api.url}") String baseUrl,
            @Value("${perplexity.api.key}") String apiKey
    ) {
        this.webClient = webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    /**
     * Analyze the resume using Perplexity AI.
     * @param resumeText The text of the candidate's resume
     * @param jobDescription The job description
     * @return String containing Perplexity's response as JSON
     */
    public String analyzeResume(String resumeText, String jobDescription) {
        String prompt = """
        You are an AI-powered recruiter and resume analyst.
        Analyze the following resume for the job described below.

        RESUME:
        %s

        JOB DESCRIPTION:
        %s

        Please provide: these details with headings
        -Summary
        -Strengths
        -Areas for Improvement
        -Detailed Feedback Keep the feedback clear, professional, and actionable.
        """.formatted(resumeText, jobDescription);

        try {
            ObjectMapper objectMapper = new ObjectMapper();

            Map<String, Object> message1 = Map.of("role", "system", "content", "You are a helpful assistant.");
            Map<String, Object> message2 = Map.of("role", "user", "content", prompt);

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "sonar");
            payload.put("messages", List.of(message1, message2));
            payload.put("max_tokens", 500);
            payload.put("temperature", 0.5);

            // Optional: domain filter
            payload.put("search_domain_filter", List.of("linkedin.com", "indeed.com", "monster.com"));
            payload.put("search_recency_filter", "month");

            String jsonBody = objectMapper.writeValueAsString(payload);

            return webClient.post()
                    .uri("/chat/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(jsonBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

        } catch (Exception ex) {
            ex.printStackTrace();
            return "Error while contacting Perplexity AI: " + ex.getMessage();
        }
    }

}
