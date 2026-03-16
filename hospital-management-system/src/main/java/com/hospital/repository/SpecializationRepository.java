package com.hospital.repository;

import com.hospital.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SpecializationRepository extends JpaRepository<Specialization, Long> {
    List<Specialization> findByIsActive(Boolean isActive);
    List<Specialization> findByDepartmentIdAndIsActive(Long departmentId, Boolean isActive);
}
