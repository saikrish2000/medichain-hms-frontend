package com.hospital.repository;

import com.hospital.entity.AmbulanceCall;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AmbulanceCallRepository extends JpaRepository<AmbulanceCall, Long> {
    long countByStatus(AmbulanceCall.CallStatus status);
    Page<AmbulanceCall> findAllByOrderByRequestTimeDesc(Pageable pageable);
}
