package com.smartcampus.Booking;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByStatus(String status);

    /**
     * Conflict rule:
     *   Same location + same date + status is PENDING or APPROVED
     *   + time ranges OVERLAP  →  existingStart < newEnd  AND  existingEnd > newStart
     *
     * This means:
     *   ✅  Different location  →  allowed
     *   ✅  Different date      →  allowed
     *   ✅  Same location+date but NO time overlap  →  allowed
     *   ❌  Same location+date+overlapping time  →  BLOCKED
     */
    @Query("{ " +
           "'location': { $regex: ?0, $options: 'i' }, " +
           "'date': ?1, " +
           "'status': { $in: ['PENDING', 'APPROVED'] }, " +
           "'startTime': { $lt: ?3 }, " +
           "'endTime':   { $gt: ?2 } " +
           "}")
    List<Booking> findConflictingBookings(String location,
                                          LocalDate date,
                                          LocalTime newStart,
                                          LocalTime newEnd);
}
