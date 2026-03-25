package com.hospital.service;

import com.hospital.entity.Appointment;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReceptionistService {

    private final AppointmentRepository appointmentRepo;

    @Transactional
    public Appointment checkIn(Long appointmentId) {
        Appointment appt = appointmentRepo.findById(appointmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment","id",appointmentId));
        appt.setStatus(Appointment.AppointmentStatus.IN_PROGRESS);
        appt.setCheckedInAt(java.time.LocalDateTime.now());
        return appointmentRepo.save(appt);
    }
}
