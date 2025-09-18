package com.resumeai.resumeanalyzer.dto;

import lombok.Data;
import reactor.util.annotation.NonNull;

@Data
public class AuthRequest {
    @NonNull
    private String username;
    @NonNull
    private String password;

}
