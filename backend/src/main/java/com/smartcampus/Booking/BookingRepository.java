package com.smartcampus.Booking; // Fixed: Matches your folder name exactly

import org.springframework.data.mongodb.repository.MongoRepository; // Use Mongo, not JPA
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    // This allows the controller to filter bookings by user email
    List<Booking> findByUserEmail(String userEmail);
}