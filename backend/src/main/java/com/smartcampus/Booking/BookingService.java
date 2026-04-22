package com.smartcampus.Booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired private BookingRepository        repository;
    @Autowired private SequenceGeneratorService sequenceGenerator;

    // ── CREATE ──────────────────────────────────────────────────────

    public Booking createBooking(Booking booking) {

        // Validation
        if (booking.getStudentId() == null || booking.getStudentId().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student ID is required.");
        if (booking.getLocation() == null || booking.getLocation().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location is required.");
        if (booking.getDate() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date is required.");
        if (booking.getStartTime() == null || booking.getEndTime() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start and end time are required.");
        if (!booking.getEndTime().isAfter(booking.getStartTime()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time.");

        // ── Conflict check: same location + same date + overlapping time ──
        List<Booking> conflicts = repository.findConflictingBookings(
                booking.getLocation().trim(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            Booking clash = conflicts.get(0);
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This location (" + booking.getLocation() + ") is already booked on " +
                    booking.getDate() + " from " + clash.getStartTime() +
                    " to " + clash.getEndTime() +
                    ". Please choose a different time slot.");
        }

        // Save
        booking.setId(sequenceGenerator.generateAvailableId());
        booking.setStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        return repository.save(booking);
    }

    // ── READ ─────────────────────────────────────────────────────────

    public List<Booking> getBookings(String status) {
        if (status != null && !status.isBlank()) return repository.findByStatus(status);
        return repository.findAll();
    }

    public Booking getBookingById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Booking " + id + " not found."));
    }

    // ── STATUS UPDATE ─────────────────────────────────────────────────

    public Booking updateStatus(String id, String newStatus, String reason) {
        Booking booking = getBookingById(id);
        String current  = booking.getStatus();

        boolean valid = switch (current) {
            case "PENDING"  -> newStatus.equals("APPROVED") || newStatus.equals("REJECTED");
            case "APPROVED" -> newStatus.equals("CANCELLED");
            default         -> false;
        };
        if (!valid)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot transition from " + current + " to " + newStatus + ".");

        booking.setStatus(newStatus);
        if ("REJECTED".equals(newStatus) && reason != null && !reason.isBlank())
            booking.setRejectionReason(reason);
        booking.setUpdatedAt(LocalDateTime.now());
        return repository.save(booking);
    }

    // ── DELETE ───────────────────────────────────────────────────────

    public void deleteBooking(String id) {
        repository.delete(getBookingById(id));
    }
}
