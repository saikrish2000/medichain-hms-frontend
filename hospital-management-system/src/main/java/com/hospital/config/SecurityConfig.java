package com.hospital.config;

import com.hospital.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // ── Public endpoints ──────────────────────────────
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()

                // ── Admin ─────────────────────────────────────────
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // ── Doctor ────────────────────────────────────────
                .requestMatchers("/api/doctor/**").hasRole("DOCTOR")

                // ── Nurse ─────────────────────────────────────────
                .requestMatchers("/api/nurse/**").hasRole("NURSE")

                // ── Patient ───────────────────────────────────────
                .requestMatchers("/api/patient/**").hasRole("PATIENT")

                // ── Pharmacy ──────────────────────────────────────
                .requestMatchers("/api/pharmacy/**").hasAnyRole("PHARMACIST","ADMIN")

                // ── Lab ───────────────────────────────────────────
                .requestMatchers("/api/lab/**").hasAnyRole("LAB_TECHNICIAN","ADMIN","DOCTOR")

                // ── Blood bank ────────────────────────────────────
                .requestMatchers("/api/blood-bank/**").hasAnyRole("BLOOD_BANK_MANAGER","ADMIN")

                // ── Ambulance ─────────────────────────────────────
                .requestMatchers("/api/ambulance/**").hasAnyRole("AMBULANCE_OPERATOR","ADMIN")

                // ── Billing ───────────────────────────────────────
                .requestMatchers("/api/billing/my-bills").hasRole("PATIENT")
                .requestMatchers("/api/billing/**").hasAnyRole("ADMIN","RECEPTIONIST")

                // ── Receptionist ──────────────────────────────────
                .requestMatchers("/api/receptionist/**").hasAnyRole("RECEPTIONIST","ADMIN")

                // ── Appointments (public booking flow) ────────────
                .requestMatchers("/api/appointments/specializations",
                                 "/api/appointments/doctors",
                                 "/api/appointments/slots").authenticated()
                .requestMatchers("/api/appointments/**").authenticated()

                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        var p = new DaoAuthenticationProvider();
        p.setUserDetailsService(userDetailsService);
        p.setPasswordEncoder(passwordEncoder());
        return p;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }
}
