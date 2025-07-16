package com.resumeai.resumeanalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeData {
    // This class represents the data structure for a resume
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for the resume
    private String PositionTitle;
    private String name;
    private String email;
    private String phone;
    @Column(length = 500)
    private String resumePath;

}
