package main.java.com.resumeai.resumeanalyzer.service;


import main.java.com.resumeai.resumeanalyzer.model.ResumeData;
import main.java.com.resumeai.resumeanalyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.tika.Tika;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final ATSScorerAI atsScorerAI;

    private final QnAService qnAService;
    private final PerplexityAiWebClientService perplexityAiWebClientService;

    private final Logger logger = LoggerFactory.getLogger(ResumeServiceImpl.class);

    public Map<String, Object> parseAndSaveResume(MultipartFile file,
                                                  String name,
                                                  String email,
                                                  String phone,
                                                  String positionTitle,
                                                  String jobDescription) throws IOException {

        String filePath = saveFileToDisk(file);

        // 2. Extract raw text from the file
        File savedFile = new File(filePath);
        String rawText = extractTextFromFile(savedFile);

        // 3. Call the ATS Scorer AI to get the result object
        // This is the corrected part
        ATSScorerAI.AtsResult atsResult = atsScorerAI.getATSScore(rawText, jobDescription);
//        logger.info("rawText={}, jobDescription={}", rawText, jobDescription);
//        String feedback = qnAService.getResumeFeedback(jobDescription, rawText);
//       String feedback = aiFeedbackService.getResumeFeedback(name, positionTitle, rawText);
//        logger.info("resumeFeedback={}", feedback);
        // 4. Create and populate your ResumeData entity
        String feedback = perplexityAiWebClientService.analyzeResume(rawText, jobDescription);
        logger.info("feedback2={}", feedback);

        ResumeData resumeData = new ResumeData();
        resumeData.setName(name);
        resumeData.setEmail(email);
        resumeData.setPhone(phone);
        resumeData.setPositionTitle(positionTitle);
        resumeData.setResumePath(filePath);
        resumeData.setJobDescription(jobDescription);

         resumeData.setAtsScore(atsResult.getScore());
        resumeRepository.save(resumeData);

        System.out.println("ATS Score: " + atsResult.getScore());
        JSONObject feedbackJson = new JSONObject(feedback); // full response
        String gptContent = feedbackJson.getJSONArray("choices")
                .getJSONObject(0)
                .getJSONObject("message")
                .getString("content");

        Map<String, Object> feedbackParsed = extractFeedbackFromGPT(gptContent);
        logger.info("Parsed feedback: {}", feedbackParsed);

        Map<String, Object> response = new HashMap<>();
        response.put("atsScore", atsResult.getScore());
        response.put("feedback", feedbackParsed);

        logger.info("Final response: {}", response);
        return response;
    }

    private String saveFileToDisk(MultipartFile file) throws IOException {
        String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String filePath = uploadDir + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File savedFile = new File(filePath);
        file.transferTo(savedFile);

        return savedFile.getAbsolutePath();
    }
    private String extractTextFromFile(File file) throws IOException {
        try (PDDocument doc = PDDocument.load(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            logger.info("PDF Text Stripper found.");
            return stripper.getText(doc);

        } catch (Exception e) {
            // Fallback to Apache Tika if PDFBox fails
            try {
                Tika tika = new Tika();
                logger.info("Tika found.");
                return tika.parseToString(file);
            } catch (Exception ex) {
                throw new IOException("Failed to extract text using both PDFBox and Tika", ex);
            }
        }
    }
//    public Map<String, Object> extractFeedbackFromGPT(String gptContent) {
//        Map<String, Object> feedback = new HashMap<>();
//
//        String summary = "";
//        List<String> strengths = new ArrayList<>();
//        List<String> improvements = new ArrayList<>();
////        StringBuilder currentSection = new StringBuilder();
//
//        String[] lines = gptContent.split("\n");
//        String section = "";
//
//        for (String line : lines) {
//            line = line.trim();
//
//            if (line.equalsIgnoreCase("### Summary")) {
//                section = "summary";
//                continue;
//            } else if (line.equalsIgnoreCase("### Strengths")) {
//                section = "strengths";
//                continue;
//            } else if (line.equalsIgnoreCase("### Areas for Improvement")) {
//                section = "improvements";
//                continue;
//            }
//
//            switch (section) {
//                case "summary":
//                    summary += line + " ";
//                    break;
//                case "strengths":
//                    if (line.startsWith("-")) strengths.add(line.substring(1).trim());
//                    break;
//                case "improvements":
//                    if (line.startsWith("-")) improvements.add(line.substring(1).trim());
//                    break;
//            }
//        }
//
//        feedback.put("summary", summary.trim());
//        feedback.put("strengths", strengths);
//        feedback.put("improvements", improvements);
//        feedback.put("detailedFeedback", gptContent); // Optional
//
//        return feedback;
//    }
public static Map<String, Object> extractFeedbackFromGPT(String gptContent) {
    Map<String, Object> result = new HashMap<>();

    String summary = "";
    List<String> strengths = new ArrayList<>();
    List<String> improvements = new ArrayList<>();

    String[] sections = gptContent.split("(?m)^##?\\s+"); // Matches ## Summary, ## Strengths, etc.

    for (int i = 0; i < sections.length; i++) {
        String section = sections[i].toLowerCase().trim();
        if (section.startsWith("summary")) {
            summary = sections[i + 1].trim();
        } else if (section.startsWith("strengths")) {
            strengths = extractBullets(sections[i + 1]);
        } else if (section.startsWith("areas for improvement")) {
            improvements = extractBullets(sections[i + 1]);
        }
    }

    result.put("summary", summary);
    result.put("strengths", strengths);
    result.put("improvements", improvements);
    result.put("detailedFeedback", gptContent); // retain full markdown as well

    return result;
}

    private static List<String> extractBullets(String text) {
        List<String> bullets = new ArrayList<>();
        for (String line : text.split("\n")) {
            if (line.trim().startsWith("-")) {
                bullets.add(line.replaceFirst("-\\s*", "").trim());
            } else if (line.trim().startsWith("**")) {
                bullets.add(line.trim());
            }
        }
        return bullets;
    }





}
