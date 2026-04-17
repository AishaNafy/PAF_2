import React, { useState } from 'react'; // Booking: Required for state

const BookingRequestPage = () => {
    // Booking: Define state to store form inputs
    const [formData, setFormData] = useState({
        resourceId: '', 
        date: '', 
        startTime: '', 
        endTime: '', 
        purpose: '', 
        expectedAttendees: ''
    });

    // Booking: Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => alert("Booking Sent! Status: " + data.status))
        .catch(err => alert("Error: Conflict or System failure"));
    };

    return (
        <div style={{ backgroundColor: '#ffffff', padding: '20px' }}>
            <h2 style={{ color: '#010101' }}>Request a Resource</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* Resource ID Input */}
                <input 
                    type="number" 
                    placeholder="Resource ID" 
                    value={formData.resourceId}
                    onChange={e => setFormData({...formData, resourceId: e.target.value})} 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                {/* Date Input */}
                <input 
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                {/* Start Time with Label - Requirement for identifying time in letters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ color: '#010101', fontSize: '14px' }}>Start Time</label>
                    <input 
                        type="time" 
                        value={formData.startTime}
                        onChange={e => setFormData({...formData, startTime: e.target.value})} 
                        required 
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                {/* End Time with Label - Requirement for identifying time in letters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ color: '#010101', fontSize: '14px' }}>End Time</label>
                    <input 
                        type="time" 
                        value={formData.endTime}
                        onChange={e => setFormData({...formData, endTime: e.target.value})} 
                        required 
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                {/* Purpose Textarea */}
                <textarea 
                    placeholder="Purpose" 
                    value={formData.purpose}
                    onChange={e => setFormData({...formData, purpose: e.target.value})} 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '100px' }}
                />
                
                {/* Button Container - Aligned to right as per reference images */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    {/* Cancel Button - Styled per reference image */}
                    <button 
                        type="button" 
                        style={{ 
                            backgroundColor: '#f3f4f6', 
                            color: '#374151', 
                            padding: '10px 24px', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Cancel
                    </button>

                    {/* Submit Request Button - Updated to teal color #14b8a6 and bold font */}
                    <button 
                        type="submit" 
                        style={{ 
                            backgroundColor: '#14b8a6', 
                            color: '#ffffff', 
                            padding: '10px 24px', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingRequestPage;