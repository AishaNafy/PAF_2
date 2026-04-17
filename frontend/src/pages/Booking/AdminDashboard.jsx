import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetch('/api/bookings').then(res => res.json()).then(data => setBookings(data));
    }, []);

    const updateStatus = (id, status) => {
        const reason = status === 'REJECTED' ? prompt("Enter rejection reason:") : "";
        fetch(`/api/bookings/${id}/status?status=${status}&reason=${reason}`, { method: 'PUT' })
            .then(() => window.location.reload());
    };

    return (
        <div style={{ backgroundColor: '#ffffff' }}>
            <h2>Manage All Bookings</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tr style={{ backgroundColor: '#dafff7' }}>
                    <th>ID</th><th>User</th><th>Status</th><th>Actions</th>
                </tr>
                {bookings.map(b => (
                    <tr key={b.id}>
                        <td>{b.id}</td><td>{b.userEmail}</td><td>{b.status}</td>
                        <td>
                            <button onClick={() => updateStatus(b.id, 'APPROVED')} style={{ color: 'green' }}>Approve</button>
                            <button onClick={() => updateStatus(b.id, 'REJECTED')} style={{ color: 'red' }}>Reject</button>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default AdminDashboard;