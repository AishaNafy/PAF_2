package com.smartcampus.Booking;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // Filter by student ID
    List<Booking> findByStudentId(String studentId);

    // Filter by status
    List<Booking> findByStatus(String status);

    // Conflict detection: same resource, same date, overlapping time, not cancelled/rejected
    @Query("{ 'resourceId': ?0, 'date': ?1, 'status': { $in: ['PENDING','APPROVED'] }, " +
           "'startTime': { $lt: ?3 }, 'endTime': { $gt: ?2 } }")
    List<Booking> findConflictingBookings(Long resourceId,
                                          LocalDate date,
                                          LocalTime newStart,
                                          LocalTime newEnd);
}
