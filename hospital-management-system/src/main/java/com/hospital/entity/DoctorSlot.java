package com.hospital.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "doctor_slots")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DoctorSlot {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "slot_date")
    private LocalDate slotDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week")
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 30;

    @Column(name = "max_patients")
    private Integer maxPatients = 1;

    @Column(name = "current_patients")
    private Integer currentPatients = 0;

    @Column(name = "is_blocked")
    private Boolean isBlocked = false;

    @Column(name = "is_recurring")
    private Boolean isRecurring = false;

    @Column(name = "block_reason", length = 255)
    private String blockReason;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
