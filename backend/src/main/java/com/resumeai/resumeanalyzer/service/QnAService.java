package com.resumeai.resumeanalyzer.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@Service
public class QnAService {

    private static final Logger logger = LoggerFactory.getLogger(QnAService.class);
//    private ChatClient chatClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final WebClient webClient;

    public QnAService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getResumeFeedback( String jobDescription, String resumeText) {
        String prompt = """
        You are an AI-powered recruiter and resume analyst.
        Analyze the following resume for the job described below.

        JOB DESCRIPTION:
        %s

        RESUME:
        %s

        Please provide: these details with headings
        -Summary
        -Strengths
        -Areas for Improvement
        -Detailed Feedback Keep the feedback clear, professional, and actionable.
        """.formatted(jobDescription, resumeText);

        // Logging the prompt being sent
        logger.info("Sending prompt to Gemini:\n{}", prompt);


        // Prepare request body
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", prompt)
                        })
                }
        );

        try {
            // Send request and log response
            String response = webClient.post()
                    .uri(geminiApiUrl + geminiApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .doOnNext(res -> logger.info("Gemini Response: {}", res))
                    .block();

            return response;
        } catch (WebClientResponseException e) {
            logger.error("Gemini API Error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return "Error fetching AI feedback from Gemini.";
        } catch (Exception e) {
            logger.error("Unexpected error during Gemini API call", e);
            return "Unexpected error while analyzing resume.";
        }
    }
}
