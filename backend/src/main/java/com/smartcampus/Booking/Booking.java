package com.smartcampus.Booking;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Document(collection = "Booking")
public class Booking {

    @Id
    private String id;

    private String studentId;   // e.g. IT22XXXXXXX
    private String location;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private String purpose;
    private int    attendees;

    private String status = "PENDING";
    private String rejectionReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Booking() {}

    public String getId()                              { return id; }
    public void   setId(String id)                     { this.id = id; }

    public String getStudentId()                       { return studentId; }
    public void   setStudentId(String studentId)       { this.studentId = studentId; }

    public String getLocation()                        { return location; }
    public void   setLocation(String location)         { this.location = location; }

    public LocalDate getDate()                         { return date; }
    public void      setDate(LocalDate date)           { this.date = date; }

    public LocalTime getStartTime()                    { return startTime; }
    public void      setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime()                      { return endTime; }
    public void      setEndTime(LocalTime endTime)     { this.endTime = endTime; }

    public String getPurpose()                         { return purpose; }
    public void   setPurpose(String purpose)           { this.purpose = purpose; }

    public int  getAttendees()                         { return attendees; }
    public void setAttendees(int attendees)            { this.attendees = attendees; }

    public String getStatus()                          { return status; }
    public void   setStatus(String status)             { this.status = status; }

    public String getRejectionReason()                       { return rejectionReason; }
    public void   setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getCreatedAt()                      { return createdAt; }
    public void          setCreatedAt(LocalDateTime v)       { this.createdAt = v; }

    public LocalDateTime getUpdatedAt()                      { return updatedAt; }
    public void          setUpdatedAt(LocalDateTime v)       { this.updatedAt = v; }
}
