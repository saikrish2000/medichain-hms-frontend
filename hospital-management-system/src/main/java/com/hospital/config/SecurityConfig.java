package com.hospital.config;

import com.hospital.security.CustomUserDetailsService;
import com.hospital.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter  jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        var p = new DaoAuthenticationProvider();
        p.setUserDetailsService(userDetailsService);
        p.setPasswordEncoder(passwordEncoder());
        return p;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()

                // Appointments (booking — public specializations/doctors/slots for booking flow)
                .requestMatchers(HttpMethod.GET,"/api/appointments/specializations").authenticated()
                .requestMatchers(HttpMethod.GET,"/api/appointments/branches").authenticated()
                .requestMatchers(HttpMethod.GET,"/api/appointments/doctors").authenticated()
                .requestMatchers(HttpMethod.GET,"/api/appointments/slots").authenticated()
                .requestMatchers(HttpMethod.POST,"/api/appointments/book").hasRole("PATIENT")
                .requestMatchers("/api/appointments/**").authenticated()

                // Admin
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Doctor
                .requestMatchers("/api/doctor/**").hasRole("DOCTOR")

                // Patient
                .requestMatchers("/api/patient/**").hasRole("PATIENT")

                // Nurse
                .requestMatchers("/api/nurse/**").hasAnyRole("NURSE","INDEPENDENT_NURSE")

                // Pharmacy
                .requestMatchers("/api/pharmacy/**").hasAnyRole("PHARMACIST","ADMIN","DOCTOR","NURSE")

                // Lab
                .requestMatchers("/api/lab/**").hasAnyRole("LAB_TECHNICIAN","PHLEBOTOMIST","DOCTOR","ADMIN")

                // Billing
                .requestMatchers("/api/billing/my-bills").hasRole("PATIENT")
                .requestMatchers("/api/billing/**").authenticated()

                // Blood Bank
                .requestMatchers("/api/blood-bank/**").hasAnyRole("BLOOD_BANK_MANAGER","ADMIN")

                // Ambulance
                .requestMatchers("/api/ambulance/**").hasAnyRole("AMBULANCE_OPERATOR","ADMIN")

                // Receptionist
                .requestMatchers("/api/receptionist/**").hasAnyRole("RECEPTIONIST","ADMIN")

                .anyRequest().authenticated()
            )
            .formLogin(f -> f.disable())
            .logout(l -> l.disable())
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
