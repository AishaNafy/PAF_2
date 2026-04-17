import React, { useEffect, useState } from 'react';

const MyBookings = () => {
    const [myBookings, setMyBookings] = useState([]);
    // In a real app, this email comes from your OAuth login session
    const userEmail = "user@sliit.lk"; 

    useEffect(() => {
        fetch(`/api/bookings/my/${userEmail}`)
            .then(res => res.json())
            .then(data => setMyBookings(data));
    }, []);

    const handleCancel = (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            fetch(`/api/bookings/${id}/status?status=CANCELLED`, { method: 'PUT' })
                .then(() => {
                    // Update local state to reflect the change
                    setMyBookings(myBookings.map(b => 
                        b.id === id ? { ...b, status: 'CANCELLED' } : b
                    ));
                });
        }
    };

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px' }}>
            <h2 style={{ color: '#010101' }}>My Booking History</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#dafff7', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Resource ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {myBookings.map(b => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #dafff7' }}>
                            <td style={{ padding: '12px' }}>{b.resourceId}</td>
                            <td>{b.date}</td>
                            <td>{b.startTime} - {b.endTime}</td>
                            <td style={{ 
                                fontWeight: 'bold', 
                                color: b.status === 'APPROVED' ? '#36bdac' : '#010101' 
                            }}>{b.status}</td>
                            <td>
                                {b.status === 'APPROVED' && (
                                    <button 
                                        onClick={() => handleCancel(b.id)}
                                        style={{ 
                                            backgroundColor: '#36bdac', 
                                            color: '#ffffff', 
                                            border: 'none', 
                                            padding: '5px 10px', 
                                            cursor: 'pointer' 
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyBookings;