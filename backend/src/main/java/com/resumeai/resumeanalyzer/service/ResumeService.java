package com.resumeai.resumeanalyzer.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;


public interface ResumeService {
    Map<String, Object> parseAndSaveResume(MultipartFile file, String name, String email, String phone, String positionTitle ,
                                           String jobDescription) throws IOException;
}



