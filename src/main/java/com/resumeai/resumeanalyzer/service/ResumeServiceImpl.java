package com.resumeai.resumeanalyzer.service;

import com.resumeai.resumeanalyzer.model.ResumeData;
import com.resumeai.resumeanalyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {
    private final Tika tika = new Tika();
    private final ResumeRepository resumeRepository;

    public String parseAndSaveResume(MultipartFile file,
                                     String name,
                                     String email,
                                     String phone,
                                     String positionTitle) throws IOException {

        String filePath = saveFileToDisk(file);

        ResumeData resumeData = new ResumeData();
        resumeData.setName(name);
        resumeData.setEmail(email);
        resumeData.setPhone(phone);
        resumeData.setPositionTitle(positionTitle);
        resumeData.setResumePath(filePath);

        resumeRepository.save(resumeData);

        return "Resume uploaded successfully!";
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

    private String extractEmail(String content) {
        Matcher matcher = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}").matcher(content);
        return matcher.find() ? matcher.group() : "Not found";
    }

    private String extractPhone(String content) {
        Matcher matcher = Pattern.compile("(\\+\\d{1,3}[- ]?)?\\d{10}").matcher(content);
        return matcher.find() ? matcher.group() : "Not found";
    }
private String extractName(String content) {
    String[] lines = content.split("\n");

    for (int i = 0; i < Math.min(10, lines.length); i++) {
        String line = lines[i].trim();

        // Skip empty lines
        if (line.isEmpty()) continue;

        // Skip lines with links or emails
        if (line.contains("@") || line.toLowerCase().contains("linkedin") || line.contains("http")) continue;

        // Skip section headings
        if (line.toLowerCase().matches(".*(profile|objective|summary|curriculum).*")) continue;

        // Accept names like: "Ankush Choudhary", "Ankush S Choudhary"
        if (line.matches("([A-Z][a-z]*\\s){1,3}[A-Z][a-z]*")) {
            return line;
        }

        // Accept all caps names like: "ANKUSH CHOUDHARY"
        if (line.matches("[A-Z]{2,}(\\s[A-Z]{2,})+")) {
            return line;
        }
    }

    return "Not Found";
}

}
