package com.hospital.repository;

import com.hospital.entity.Doctor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserId(Long userId);
    Page<Doctor>     findByApprovalStatus(Doctor.ApprovalStatus status, Pageable pageable);
    List<Doctor>     findByApprovalStatus(Doctor.ApprovalStatus status);
    long             countByApprovalStatus(Doctor.ApprovalStatus status);
    List<Doctor>     findBySpecializationId(Long specId);
    List<Doctor>     findBySpecializationIdAndApprovalStatusAndBranchId(
                         Long specId, Doctor.ApprovalStatus status, Long branchId);

    @Query("SELECT d FROM Doctor d JOIN d.user u " +
           "WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%',:q,'%')) " +
           "OR LOWER(u.lastName)  LIKE LOWER(CONCAT('%',:q,'%')) " +
           "OR LOWER(d.specialization.name) LIKE LOWER(CONCAT('%',:q,'%'))")
    Page<Doctor> search(@Param("q") String q, Pageable pageable);
}
