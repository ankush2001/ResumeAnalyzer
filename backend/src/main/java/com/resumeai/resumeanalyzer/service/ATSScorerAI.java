package com.resumeai.resumeanalyzer.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ATSScorerAI {

    private static final Logger logger = LoggerFactory.getLogger(ATSScorerAI.class);

    private final WebClient webClient;
    private final String modelUrl;

    public static class AtsResult {
        private final double score;
        private final String explanation;

        public AtsResult(double score, String explanation) {
            this.score = score;
            this.explanation = explanation;
        }

        public double getScore() { return score; }
        public String getExplanation() { return explanation; }
    }

    public ATSScorerAI(
            @Value("${spring.ai.huggingface.api-key}") String apiKey,
            @Value("${spring.ai.huggingface.model-id}") String modelId,
            @Value("${spring.ai.huggingface.base-url}") String baseUrl
    ) {
        this.modelUrl = baseUrl + "/models/" + modelId;
        this.webClient = WebClient.builder()
                .baseUrl(this.modelUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();

        logger.info("✅ ATSScorerAI initialized for model: {}", this.modelUrl);
    }

    /**
     * Computes the ATS score using Hugging Face's sentence similarity pipeline.
     */
    public AtsResult getATSScore(String resumeText, String jobDescription) {
        if (resumeText == null || resumeText.trim().isEmpty()) {
            logger.error("Resume text is empty. Cannot calculate score.");
            return new AtsResult(0.0, "Error: The resume text was empty.");
        }
        if (jobDescription == null || jobDescription.trim().isEmpty()) {
            logger.error("Job description is empty. Cannot calculate score.");
            return new AtsResult(0.0, "Error: The job description was empty.");
        }

        try {
            logger.info("➡️ Requesting similarity score from Hugging Face...");

            // ✅ Required structure for sentence-transformers pipeline
            Map<String, Object> payload = new HashMap<>();
            Map<String, Object> inputs = new HashMap<>();
            inputs.put("source_sentence", jobDescription);
            inputs.put("sentences", List.of(resumeText));
            payload.put("inputs", inputs);

            // Log the payload for debugging
            logger.info("Payload for Hugging Face API:");
            logger.info(payload.toString());


            // Optional: wait for model if it's sleeping
            payload.put("options", Map.of("wait_for_model", true));

            // Make the HTTP POST call to HF inference API
            List<Double> result = webClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            if (result == null || result.isEmpty()) {
                logger.error("❌ Empty or null result from HF model");
                return new AtsResult(0.0, "Error: Empty result from Hugging Face.");
            }

            double score = result.get(0) * 100;
            String explanation = String.format(
                    "The score is based on semantic similarity between resume and job description. Score: %.2f%%",
                    score
            );

            logger.info("✅ ATS Score computed: {}", score);
            return new AtsResult(score, explanation);

        } catch (WebClientResponseException ex) {
            logger.error("❌ Hugging Face API Error - Status: {}, Body: {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            return new AtsResult(0.0, "Error scoring resume. Response: " + ex.getResponseBodyAsString());
        } catch (Exception e) {
            logger.error("❌ Exception during scoring: {}", e.getMessage(), e);
            return new AtsResult(0.0, "Error scoring resume. Exception: " + e.getMessage());
        }
    }
}
