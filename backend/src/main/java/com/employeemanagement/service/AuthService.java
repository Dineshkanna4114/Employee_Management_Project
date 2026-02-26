package com.employeemanagement.service;

import com.employeemanagement.dto.JwtResponse;
import com.employeemanagement.dto.LoginRequest;
import com.employeemanagement.entity.User;
import com.employeemanagement.repository.UserRepository;
import com.employeemanagement.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("")
                .replace("ROLE_", "");

        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        return new JwtResponse(jwt, user.getId(), userDetails.getUsername(), user.getEmail(), role);
    }

    @Bean
    public CommandLineRunner initDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@company.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(User.Role.ADMIN)
                        .enabled(true)
                        .build();
                userRepository.save(admin);
                System.out.println("✅ Default admin created: username=admin, password=admin123");
            }
            if (!userRepository.existsByUsername("user")) {
                User user = User.builder()
                        .username("user")
                        .email("user@company.com")
                        .password(passwordEncoder.encode("user123"))
                        .role(User.Role.USER)
                        .enabled(true)
                        .build();
                userRepository.save(user);
                System.out.println("✅ Default user created: username=user, password=user123");
            }
        };
    }
}
