package com.hospital.service;

import com.hospital.entity.*;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.*;
import com.hospital.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PharmacyService {

    private final MedicineRepository     medicineRepo;
    private final PrescriptionRepository prescriptionRepo;
    private final PatientRepository      patientRepo;
    private final DoctorRepository       doctorRepo;
    private final AppointmentRepository  appointmentRepo;

    public Medicine saveMedicine(Medicine medicine) { return medicineRepo.save(medicine); }

    @Transactional
    public Medicine updateStock(Long medicineId, int quantity, String operation) {
        Medicine m = medicineRepo.findById(medicineId)
            .orElseThrow(() -> new ResourceNotFoundException("Medicine","id",medicineId));
        int current = m.getCurrentStock();
        if ("add".equals(operation))      m.setCurrentStock(current + quantity);
        else if ("subtract".equals(operation)) {
            if (current < quantity) throw new BadRequestException("Insufficient stock");
            m.setCurrentStock(current - quantity);
        } else m.setCurrentStock(quantity);
        return medicineRepo.save(m);
    }

    @Transactional
    public Prescription createPrescription(Long patientId, Long doctorId,
                                           Long appointmentId, String notes,
                                           List<Map<String,Object>> items) {
        Patient patient = patientRepo.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient","id",patientId));
        Doctor doctor = doctorRepo.findById(doctorId)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor","id",doctorId));

        Prescription rx = new Prescription();
        rx.setPatient(patient);
        rx.setDoctor(doctor);
        rx.setNotes(notes);
        rx.setStatus(Prescription.Status.PENDING);
        rx.setCreatedAt(LocalDateTime.now());

        if (appointmentId != null) {
            appointmentRepo.findById(appointmentId).ifPresent(rx::setAppointment);
        }

        List<PrescriptionItem> rxItems = new ArrayList<>();
        if (items != null) {
            for (Map<String,Object> item : items) {
                PrescriptionItem pi = new PrescriptionItem();
                Long medId = Long.parseLong(item.get("medicineId").toString());
                Medicine med = medicineRepo.findById(medId)
                    .orElseThrow(() -> new ResourceNotFoundException("Medicine","id",medId));
                pi.setMedicine(med);
                pi.setDosage((String) item.get("dosage"));
                pi.setFrequency((String) item.get("frequency"));
                pi.setDuration((String) item.get("duration"));
                pi.setInstructions((String) item.getOrDefault("instructions",""));
                pi.setPrescription(rx);
                rxItems.add(pi);
            }
        }
        rx.setItems(rxItems);
        return prescriptionRepo.save(rx);
    }

    @Transactional
    public Prescription dispensePrescription(Long prescriptionId, UserPrincipal pharmacist) {
        Prescription rx = prescriptionRepo.findById(prescriptionId)
            .orElseThrow(() -> new ResourceNotFoundException("Prescription","id",prescriptionId));
        if (rx.getStatus() == Prescription.Status.DISPENSED)
            throw new BadRequestException("Already dispensed");

        // Deduct stock for each item
        for (PrescriptionItem item : rx.getItems()) {
            Medicine med = item.getMedicine();
            int qty = parseQty(item.getDuration());
            if (med.getCurrentStock() >= qty) {
                med.setCurrentStock(med.getCurrentStock() - qty);
                medicineRepo.save(med);
            }
        }
        rx.setStatus(Prescription.Status.DISPENSED);
        rx.setDispensedAt(LocalDateTime.now());
        return prescriptionRepo.save(rx);
    }

    private int parseQty(String duration) {
        try { return Integer.parseInt(duration.replaceAll("[^0-9]","")); }
        catch (Exception e) { return 1; }
    }
}
