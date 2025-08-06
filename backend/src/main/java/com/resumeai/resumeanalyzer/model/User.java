package com.resumeai.resumeanalyzer.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "users")
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true , nullable = false)
    private String username;
    @Column(unique = true , nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

}
