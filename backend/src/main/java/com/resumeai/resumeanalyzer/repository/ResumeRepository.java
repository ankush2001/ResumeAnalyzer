package com.resumeai.resumeanalyzer.repository;

import com.resumeai.resumeanalyzer.model.ResumeData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<ResumeData, Long> {
    // This interface extends JpaRepository to provide CRUD operations for ResumeData
    // JpaRepository provides methods like save, findById, findAll, deleteById, etc.
    // No additional methods are needed here as JpaRepository already provides the necessary functionality
}
