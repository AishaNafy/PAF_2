package com.smartcampus.Booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000") 
public class BookingController {

    @Autowired
    private BookingRepository repository;

    // Inject the new sequence service
    @Autowired
    private SequenceGeneratorService sequenceGenerator;

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        // Automatically calculate and set the ID starting as B001
        // This logic ensures deleted IDs can be reused
        String newId = sequenceGenerator.generateAvailableId();
        booking.setId(newId);
        return repository.save(booking);
    }

    @GetMapping
    public List<Booking> getBookings(@RequestParam(required = false) String email) {
        if (email != null) return repository.findByUserEmail(email);
        return repository.findAll();
    }

    @PutMapping("/{id}/status")
    public Booking updateStatus(
        @PathVariable String id, 
        @RequestParam String status, 
        @RequestParam(required = false) String reason
    ) {
        Booking booking = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        if (reason != null) booking.setRejectionReason(reason);
        return repository.save(booking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable String id) {
        repository.deleteById(id);
    }
}