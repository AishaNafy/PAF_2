import React, { useState } from 'react';

const BookingRequestPage = () => {
    const [formData, setFormData] = useState({
        resourceId: '',
        location: '',
        userEmail: 'user@sliit.lk',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = (name === 'resourceId' || name === 'attendees') 
            ? parseInt(value) || '' 
            : value;
        setFormData({ ...formData, [name]: updatedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const savedData = await response.json(); 
                alert(`Booking submitted! ID: ${savedData.id}`);
            } else {
                const errorText = await response.text();
                alert(`Server Error: ${errorText}`);
            }
        } catch (error) {
            alert("Submission failed. Check backend connection.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">New Booking</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
                {/* Row 1: ID and Location */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resource ID (Number)</label>
                        <input type="number" name="resourceId" value={formData.resourceId} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input name="location" value={formData.location} placeholder="e.g. Building A" onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                </div>

                {/* Row 2: Attendees and Date */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
                        <input type="number" name="attendees" value={formData.attendees} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                </div>

                {/* Row 3: Times */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <textarea name="purpose" value={formData.purpose} onChange={handleChange} className="w-full p-2 border rounded h-24" required />
                </div>

                <div className="flex gap-3">
                    <button type="submit" className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600">Submit Request</button>
                    <button type="button" onClick={() => window.history.back()} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default BookingRequestPage;