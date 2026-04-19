import React, { useState } from 'react';

const BookingRequestPage = () => {
    // Defines missing formData and setFormData
    const [formData, setFormData] = useState({
        resourceId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        userEmail: 'user@sliit.lk' // Ensure email is included for the backend repository
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Updated handleSubmit to receive and show the B001 style ID
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const savedData = await response.json(); // Gets the response from SequenceGeneratorService
                alert(`Booking submitted successfully! Your ID is: ${savedData.id}`);
                
                // Clear form after success
                setFormData({
                    resourceId: '',
                    date: '',
                    startTime: '',
                    endTime: '',
                    purpose: '',
                    userEmail: 'user@sliit.lk'
                });
            }
        } catch (error) {
            console.error("Error submitting booking:", error);
            alert("Submission failed. Check backend connection.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">New Booking</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resource ID</label>
                    <input name="resourceId" value={formData.resourceId} placeholder="e.g. Lab 01" onChange={handleChange} className="w-full p-2 border rounded"/>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded"/>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-2 border rounded"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full p-2 border rounded"/>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <textarea name="purpose" value={formData.purpose} placeholder="Describe the reason for booking" onChange={handleChange} className="w-full p-2 border rounded h-24"/>
                </div>

                <div className="flex gap-3">
                    <button 
                        type="submit" 
                        className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 font-medium transition-colors"
                    >
                        Submit Request
                    </button>
                    
                    {/* Added Cancel button to match your requested layout */}
                    <button 
                        type="button"
                        onClick={() => window.history.back()}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingRequestPage;