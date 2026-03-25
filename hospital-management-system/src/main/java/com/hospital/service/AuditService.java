package com.hospital.service;

import com.hospital.entity.AuditLog;
import com.hospital.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(Long userId, String username, String action,
                    String entityType, Long entityId,
                    String ipAddress, String status) {
        try {
            AuditLog entry = AuditLog.builder()
                    .userId(userId).username(username).action(action)
                    .entityType(entityType).entityId(entityId)
                    .ipAddress(ipAddress)
                    .status(AuditLog.Status.valueOf(status))
                    .createdAt(LocalDateTime.now())
                    .build();
            auditLogRepository.save(entry);
        } catch (Exception e) {
            log.error("Audit log error: {}", e.getMessage());
        }
    }

    @Async
    public void log(String username, String action,
                    String entityType, Long entityId, String notes) {
        try {
            AuditLog entry = AuditLog.builder()
                    .username(username).action(action)
                    .entityType(entityType).entityId(entityId)
                    .notes(notes).status(AuditLog.Status.SUCCESS)
                    .createdAt(LocalDateTime.now())
                    .build();
            auditLogRepository.save(entry);
        } catch (Exception e) {
            log.error("Audit log error: {}", e.getMessage());
        }
    }

    public Page<AuditLog> getAll(int page) {
        return auditLogRepository.findAll(
            PageRequest.of(page, 50, Sort.by("createdAt").descending()));
    }

    public List<AuditLog> getByUserId(Long userId) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
