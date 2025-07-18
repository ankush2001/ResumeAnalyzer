package com.resumeai.resumeanalyzer.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


public interface ResumeService {
    String parseAndSaveResume(MultipartFile file, String name, String email, String phone, String positionTitle ,
                              String jobDescription) throws IOException;
}



