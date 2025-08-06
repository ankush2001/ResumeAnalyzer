package com.resumeai.resumeanalyzer.dto;

import lombok.Data;
import reactor.util.annotation.NonNull;

@Data
public class AuthRequest {
    @NonNull
    private String email;
    @NonNull
    private String password;

}
