package com.smartcampus.Booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    /** POST /api/bookings — create a new PENDING booking */
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(booking));
    }

    /**
     * GET /api/bookings — returns ALL bookings.
     * Optional filter: ?status=PENDING | APPROVED | REJECTED | CANCELLED
     */
    @GetMapping
    public ResponseEntity<List<Booking>> getBookings(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(bookingService.getBookings(status));
    }

    /** GET /api/bookings/{id} — single booking by ID */
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    /**
     * PUT /api/bookings/{id}/status — approve, reject, or cancel a booking.
     * Body: { "status": "APPROVED" | "REJECTED" | "CANCELLED", "reason": "..." }
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(
                bookingService.updateStatus(id, payload.get("status"), payload.get("reason")));
    }

    /** DELETE /api/bookings/{id} — hard-delete (admin only) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
