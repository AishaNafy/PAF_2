package com.smartcampus.Booking;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByStudentId(String studentId);

    List<Booking> findByStatus(String status);

    /**
     * Conflict detection:
     * Same location + same date + overlapping time range + not already REJECTED or CANCELLED.
     *
     * Overlap condition: existingStart < newEnd  AND  existingEnd > newStart
     * This catches:  exact same time, partial overlap, and one booking inside another.
     */
    @Query("{ 'location': ?0, 'date': ?1, " +
           "'status': { $in: ['PENDING', 'APPROVED'] }, " +
           "'startTime': { $lt: ?3 }, " +
           "'endTime':   { $gt: ?2 } }")
    List<Booking> findConflictingBookings(String location,
                                          LocalDate date,
                                          LocalTime newStart,
                                          LocalTime newEnd);
}
