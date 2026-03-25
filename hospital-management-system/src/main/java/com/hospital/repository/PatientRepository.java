package com.hospital.repository;

import com.hospital.entity.Patient;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUserId(Long userId);

    @Query("SELECT p FROM Patient p WHERE p.doctor.id = :doctorId")
    Page<Patient> findByDoctorId(@Param("doctorId") Long doctorId, Pageable pageable);

    @Query("SELECT p FROM Patient p JOIN p.user u " +
           "WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%',:q,'%')) " +
           "OR LOWER(u.lastName)  LIKE LOWER(CONCAT('%',:q,'%')) " +
           "OR LOWER(u.email)     LIKE LOWER(CONCAT('%',:q,'%')) " +
           "OR u.phone            LIKE CONCAT('%',:q,'%')")
    Page<Patient> search(@Param("q") String q, Pageable pageable);
}
