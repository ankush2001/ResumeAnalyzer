package com.resumeai.resumeanalyzer.controller;

/**
 * Change History – ankush
 * Date: 2025-09-11 (IST)
 * Why: Added GET /api/auth/me endpoint to return current authenticated user info
 */


import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.resumeai.resumeanalyzer.dto.AuthRequest;
import com.resumeai.resumeanalyzer.dto.AuthResponse;
import com.resumeai.resumeanalyzer.dto.RegisterRequest;
import com.resumeai.resumeanalyzer.model.Role;
import com.resumeai.resumeanalyzer.model.User;
import com.resumeai.resumeanalyzer.repository.UserRepository;
import com.resumeai.resumeanalyzer.security.JwtUtil;

@RestController
@RequestMapping("/api/auth") //-> This annotation is used to map HTTP requests to specific handler
public class AuthController {


    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private JwtUtil jwtUtil;
    private PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder passwordEncoder,JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already in use";

        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username already in use";
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.User); // Assuming a default role of USER, adjust as necessary
        userRepository.save(user);
        return "User registered successfully";
    }


    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) {
       Authentication authentication = authenticationManager.authenticate(
               new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtil.generateToken(authentication); // Pass the authenticated object
        return new AuthResponse(token);
    }

    @GetMapping("/me")
    public java.util.Map<String, Object> getCurrentUser(java.security.Principal principal) {
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        userRepository.findByUsername(principal.getName()).ifPresent(u -> {
            map.put("id", u.getId());
            map.put("username", u.getUsername());
            map.put("email", u.getEmail());
            map.put("roles", u.getRole());
        });
        return map;
    }
}
