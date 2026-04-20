import React, { useEffect, useState } from 'react';

const MyBookings = () => {
    const [myBookings, setMyBookings] = useState([]);
    const userEmail = "user@sliit.lk"; 

    useEffect(() => {
        fetch(`/api/bookings?email=${userEmail}`)
            .then(res => res.json())
            .then(data => setMyBookings(data));
    }, []);

    const handleCancel = (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            fetch(`/api/bookings/${id}/status?status=CANCELLED`, { method: 'PUT' })
                .then(() => {
                    setMyBookings(myBookings.map(b => 
                        b.id === id ? { ...b, status: 'CANCELLED' } : b
                    ));
                });
        }
    };

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px' }}>
            <h2 style={{ color: '#010101', marginBottom: '20px' }}>My Booking History</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#dafff7', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Resource ID</th>
                            <th>Location</th> {/* Added Column */}
                            <th>Attendees</th> {/* Added Column */}
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Purpose</th> {/* Added Column */}
                            <th>Status</th>
                            <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myBookings.map(b => (
                            <tr key={b.id} style={{ borderBottom: '1px solid #dafff7' }}>
                                <td style={{ padding: '12px' }}>{b.resourceId}</td>
                                <td>{b.location}</td> {/* Data for Location */}
                                <td>{b.attendees}</td> {/* Data for Attendees */}
                                <td>{b.date}</td>
                                <td>{b.startTime}</td>
                                <td>{b.endTime}</td>
                                <td>{b.purpose}</td> {/* Data for Purpose */}
                                <td style={{ 
                                    fontWeight: 'bold', 
                                    color: b.status === 'APPROVED' ? '#36bdac' : '#010101' 
                                }}>{b.status}</td>
                                <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                    {b.status !== 'CANCELLED' && (
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                            <button 
                                                onClick={() => handleCancel(b.id)}
                                                style={{ 
                                                    backgroundColor: '#e5e7eb', 
                                                    color: '#000000', 
                                                    border: 'none', 
                                                    padding: '8px 16px', 
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                style={{ 
                                                    backgroundColor: '#14b8a6', 
                                                    color: '#ffffff', 
                                                    border: 'none', 
                                                    padding: '8px 16px', 
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Submit Request
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyBookings;