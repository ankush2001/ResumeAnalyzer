package com.resumeai.resumeanalyzer.controller;

import com.resumeai.resumeanalyzer.model.ResumeData;
import com.resumeai.resumeanalyzer.repository.ResumeRepository;
import com.resumeai.resumeanalyzer.service.ResumeService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpHeaders;

//@RestController is a convenience annotation that combines @Controller and @ResponseBody
@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor // This annotation is used to generate a constructor with required arguments
public class ResumeController {

    private final ResumeService resumeService; // Injecting the ResumeService dependency
    private final ResumeRepository resumeRepository;

@PostMapping("/upload")
public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file,
                                     @RequestParam("name") String name,
                                     @RequestParam("email") String email,
                                     @RequestParam("phone") String phone,
                                     @RequestParam("positionTitle") String positionTitle) {
    try {
        String response = resumeService.parseAndSaveResume(file, name, email, phone, positionTitle);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing the resume: " + e.getMessage());
    }
}


    @GetMapping("/view-resume/{id}")
public ResponseEntity<?> viewResume(@PathVariable Long id) throws Exception {
//    ResumeData resume = resumeRepository.findById(id)
//            .orElseThrow(() -> new RuntimeException("Resume not found with id: " + id));
    Optional<ResumeData> optionalResume = resumeRepository.findById(id);

    if (optionalResume.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Resume with ID " + id + " not found");
    }

    ResumeData resume = resumeRepository.findById(id)
            .orElseThrow(() -> new FileNotFoundException("Resume with id " + id + " not found"));


    if (resume.getResumePath() == null || resume.getResumePath().isBlank()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Resume path not available for ID " + id);
    }

    File file = new File(resume.getResumePath());
    if (!file.exists() ) {
        throw new FileNotFoundException("File not found: " + resume.getResumePath());
    }



   try {
       InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

       return ResponseEntity.ok()
               .header(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=" + file.getName())
               .contentType(MediaType.APPLICATION_PDF)
               .contentLength(file.length())
               .body(resource);
   }catch (Exception e){
         throw new RuntimeException("Error reading file: " + e.getMessage());
   }
}

    @GetMapping("/all/data")
    public ResponseEntity<List<ResumeData>> getAllResumes() {
        // Retrieve all resumes and return them
        List<ResumeData> resumes = resumeRepository.findAll();
        return ResponseEntity.ok(resumes);
    }
}
