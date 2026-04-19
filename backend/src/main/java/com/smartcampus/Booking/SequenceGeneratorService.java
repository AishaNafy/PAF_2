package com.smartcampus.Booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SequenceGeneratorService {

    @Autowired
    private BookingRepository repository;

    public String generateAvailableId() {
        // Fetch all current bookings to check existing IDs
        List<Booking> allBookings = repository.findAll();
        
        // Extract the numeric part of IDs (e.g., "B005" -> 5)
        Set<Integer> existingIds = allBookings.stream()
            .map(b -> {
                try {
                    return Integer.parseInt(b.getId().substring(1));
                } catch (Exception e) {
                    return 0;
                }
            })
            .collect(Collectors.toSet());

        // Find the first numeric gap starting from 1
        int nextId = 1;
        while (existingIds.contains(nextId)) {
            nextId++;
        }

        // Format the number back into the B001 style string
        return String.format("B%03d", nextId);
    }
}