package com.hospital.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctor_slots",
       uniqueConstraints = @UniqueConstraint(
           columnNames = {"doctor_id","slot_date","start_time"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DoctorSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @Column(name = "slot_duration_minutes")
    private Integer slotDurationMinutes = 30;

    @Column(name = "max_patients")
    private Integer maxPatients = 1;

    @Enumerated(EnumType.STRING)
    private SlotType slotType = SlotType.SPECIFIC_DATE;

    @Enumerated(EnumType.STRING)
    private SlotStatus status = SlotStatus.AVAILABLE;

    @Column(name = "block_reason", length = 255)
    private String blockReason;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ── Helpers ──────────────────────────────────────────

    /** Returns the appointment time (alias for startTime, used in Appointment entity) */
    public LocalTime getSlotTime() { return startTime; }

    /** Duration alias used in Appointment booking */
    public Integer getDurationMinutes() { return slotDurationMinutes != null ? slotDurationMinutes : 30; }

    /** Is this slot currently blocked */
    public Boolean getIsBlocked() { return status == SlotStatus.BLOCKED; }

    public enum SlotType   { SPECIFIC_DATE, RECURRING }
    public enum SlotStatus { AVAILABLE, BLOCKED, FULL }
}
