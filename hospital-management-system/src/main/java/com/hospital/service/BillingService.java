package com.hospital.service;

import com.hospital.entity.*;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final InvoiceRepository     invoiceRepo;
    private final PatientRepository     patientRepo;
    private final AppointmentRepository appointmentRepo;

    @Transactional
    public Invoice createInvoice(Long patientId, Long appointmentId,
                                 List<Map<String,Object>> itemsData) {
        Patient patient = patientRepo.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient","id",patientId));

        Invoice invoice = new Invoice();
        invoice.setPatient(patient);
        invoice.setStatus(Invoice.PaymentStatus.PENDING);
        invoice.setCreatedAt(LocalDateTime.now());

        if (appointmentId != null)
            appointmentRepo.findById(appointmentId).ifPresent(invoice::setAppointment);

        List<InvoiceItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        if (itemsData != null) {
            for (Map<String,Object> d : itemsData) {
                InvoiceItem item = new InvoiceItem();
                item.setDescription((String) d.get("description"));
                BigDecimal qty   = new BigDecimal(d.get("quantity").toString());
                BigDecimal price = new BigDecimal(d.get("unitPrice").toString());
                item.setQuantity(qty.intValue());
                item.setUnitPrice(price);
                item.setTotalPrice(price.multiply(qty));
                item.setInvoice(invoice);
                items.add(item);
                total = total.add(item.getTotalPrice());
            }
        }
        invoice.setItems(items);
        invoice.setTotalAmount(total);
        return invoiceRepo.save(invoice);
    }

    @Transactional
    public Invoice createConsultationInvoice(Long patientId, Long appointmentId,
                                             BigDecimal fee) {
        return createInvoice(patientId, appointmentId,
            List.of(Map.of("description","Consultation Fee",
                           "quantity","1","unitPrice",fee.toString())));
    }

    @Transactional
    public Invoice markAsPaid(Long invoiceId, Invoice.PaymentMethod method,
                              String transactionId) {
        Invoice invoice = invoiceRepo.findById(invoiceId)
            .orElseThrow(() -> new ResourceNotFoundException("Invoice","id",invoiceId));
        if (invoice.getStatus() == Invoice.PaymentStatus.PAID)
            throw new BadRequestException("Invoice already paid");
        invoice.setStatus(Invoice.PaymentStatus.PAID);
        invoice.setPaymentMethod(method);
        invoice.setTransactionId(transactionId);
        invoice.setPaidAt(LocalDateTime.now());
        invoice.setAmountPaid(invoice.getTotalAmount());
        return invoiceRepo.save(invoice);
    }

    @Transactional
    public Invoice processPartialPayment(Long invoiceId, BigDecimal amount,
                                         Invoice.PaymentMethod method) {
        Invoice invoice = invoiceRepo.findById(invoiceId)
            .orElseThrow(() -> new ResourceNotFoundException("Invoice","id",invoiceId));
        BigDecimal paid = invoice.getAmountPaid() == null
            ? BigDecimal.ZERO : invoice.getAmountPaid();
        invoice.setAmountPaid(paid.add(amount));
        if (invoice.getAmountPaid().compareTo(invoice.getTotalAmount()) >= 0)
            invoice.setStatus(Invoice.PaymentStatus.PAID);
        else invoice.setStatus(Invoice.PaymentStatus.PARTIAL);
        invoice.setPaymentMethod(method);
        return invoiceRepo.save(invoice);
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Invoice","id",id));
    }
}
