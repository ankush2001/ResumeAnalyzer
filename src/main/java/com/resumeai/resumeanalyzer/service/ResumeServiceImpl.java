package com.resumeai.resumeanalyzer.service;

import com.resumeai.resumeanalyzer.model.ResumeData;
import com.resumeai.resumeanalyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;



@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {
    private final ResumeRepository resumeRepository;
    private final ATSScorerAI atsScorerAI;
    private final Logger logger = LoggerFactory.getLogger(ResumeServiceImpl.class);
    public String parseAndSaveResume(MultipartFile file,
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
        logger.info("rawText={}, jobDescription={}", rawText, jobDescription);
        // 4. Create and populate your ResumeData entity
        ResumeData resumeData = new ResumeData();
        resumeData.setName(name);
        resumeData.setEmail(email);
        resumeData.setPhone(phone);
        resumeData.setPositionTitle(positionTitle);
        resumeData.setResumePath(filePath);
        resumeData.setJobDescription(jobDescription);

        // It's a good practice to save the score in your database.
        // You might need to add a field like 'private Double atsScore;' to your ResumeData entity.
         resumeData.setAtsScore(atsResult.getScore());

        resumeRepository.save(resumeData);

        // 5. Use the results from the AtsResult object
        System.out.println("ATS Score: " + atsResult.getScore());
        System.out.println("Explanation: " + atsResult.getExplanation());

        // Return a more informative string to the user
        return String.format("Resume uploaded successfully! ATS Score: %.2f/100.", atsResult.getScore());
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



}
