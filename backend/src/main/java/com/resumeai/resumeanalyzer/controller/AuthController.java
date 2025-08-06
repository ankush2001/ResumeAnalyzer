package com.resumeai.resumeanalyzer.controller;


import com.resumeai.resumeanalyzer.dto.AuthRequest;
import com.resumeai.resumeanalyzer.dto.AuthResponse;
import com.resumeai.resumeanalyzer.dto.RegisterRequest;
import com.resumeai.resumeanalyzer.model.Role;
import com.resumeai.resumeanalyzer.model.User;
import com.resumeai.resumeanalyzer.repository.UserRepository;
import com.resumeai.resumeanalyzer.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth") //-> This annotation is used to map HTTP requests to specific handler
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;


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
               new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtil.generateToken(authentication); // Pass the authenticated object
        return new AuthResponse(token);
    }
}