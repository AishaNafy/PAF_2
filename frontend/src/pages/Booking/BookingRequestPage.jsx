import React, { useState } from 'react';
import {
  CalendarDays, Clock, Users, MapPin,
  Briefcase, Hash, Send, AlertCircle, BadgeInfo, AlertTriangle
} from 'lucide-react';

const API = 'http://localhost:8080/api/bookings';

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-gray-200 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#36bdac] focus:border-transparent ' +
  'text-[#010101] bg-white text-sm transition';

const labelClass = 'block text-xs font-semibold text-[#010101] mb-1 uppercase tracking-wide';

const EMPTY_FORM = {
  studentId:  '',
  resourceId: '',
  location:   '',
  date:       '',
  startTime:  '',
  endTime:    '',
  purpose:    '',
  attendees:  1,
};

// ── Conflict banner — shown when backend returns 409 ─────────────────
const ConflictBanner = ({ message, onClose }) => (
  <div className="mb-5 rounded-xl border-2 border-orange-400 bg-orange-50 p-4 flex gap-3">
    <div className="shrink-0 mt-0.5">
      <AlertTriangle size={22} className="text-orange-500" />
    </div>
    <div className="flex-1">
      <p className="font-bold text-orange-700 text-sm mb-0.5">Booking Conflict Detected</p>
      <p className="text-orange-600 text-sm leading-relaxed">{message}</p>
      <p className="text-orange-500 text-xs mt-2">
        💡 Try a different time slot or a different location.
      </p>
    </div>
    <button onClick={onClose} className="shrink-0 text-orange-400 hover:text-orange-600 text-lg leading-none">✕</button>
  </div>
);

// ── Generic error banner ──────────────────────────────────────────────
const ErrorBanner = ({ message }) => (
  <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
    <AlertCircle size={16} className="shrink-0" /> {message}
  </div>
);

const BookingRequestPage = () => {
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState('');
  const [error,    setError]    = useState('');
  const [conflict, setConflict] = useState(''); // 409 message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError(''); setSuccess(''); setConflict('');
  };

  const validate = () => {
    if (!form.studentId.trim())
      return 'Student ID is required (e.g. IT22XXXXXXX).';
    if (!form.resourceId || isNaN(parseInt(form.resourceId, 10)))
      return 'Please enter a valid numeric Resource ID.';
    if (!form.location.trim())
      return 'Location is required.';
    if (!form.date)
      return 'Please select a date.';
    if (!form.startTime)
      return 'Please select a start time.';
    if (!form.endTime)
      return 'Please select an end time.';
    if (form.endTime <= form.startTime)
      return 'End time must be after start time.';
    if (!form.purpose.trim())
      return 'Purpose is required.';
    if (parseInt(form.attendees, 10) < 1)
      return 'Attendees must be at least 1.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setConflict('');

    const ve = validate();
    if (ve) { setError(ve); return; }

    setLoading(true);
    try {
      const payload = {
        ...form,
        studentId:  form.studentId.trim().toUpperCase(),
        resourceId: parseInt(form.resourceId, 10),
        attendees:  parseInt(form.attendees, 10),
      };

      const res  = await fetch(API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.status === 409) {
        // Time-slot conflict — show prominent orange warning
        setConflict(data.error || 'This time slot is already booked for that location.');
        return;
      }

      if (res.ok) {
        setSuccess(`Booking ${data.id} submitted successfully! Status: PENDING review.`);
        setForm(EMPTY_FORM);
      } else {
        setError(data.error || data.message || 'Submission failed. Please try again.');
      }
    } catch {
      setError('Cannot reach the server. Ensure Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#010101]">New Booking Request</h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below. Your request will be reviewed by an administrator.
        </p>
      </div>

      {/* Conflict warning — 409 */}
      {conflict && (
        <ConflictBanner message={conflict} onClose={() => setConflict('')} />
      )}

      {/* Generic error */}
      {error && <ErrorBanner message={error} />}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-lg bg-[#dafff7] border border-[#36bdac] text-[#010101] text-sm font-medium">
          ✅ {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl"
      >
        {/* Row 1 — Student ID + Resource ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1"><BadgeInfo size={12}/> ID No</span>
            </label>
            <input
              type="text"
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              placeholder="e.g. IT22XXXXXXX"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1"><Hash size={12}/> Resource ID</span>
            </label>
            <input
              type="number"
              name="resourceId"
              value={form.resourceId}
              onChange={handleChange}
              placeholder="e.g. 101"
              className={inputClass}
              required
              min="1"
            />
          </div>
        </div>

        {/* Row 2 — Location + Attendees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1"><MapPin size={12}/> Location</span>
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Lab A, Room 204"
              className={`${inputClass} ${conflict ? 'border-orange-400 ring-2 ring-orange-200' : ''}`}
              required
            />
            {conflict && (
              <p className="text-xs text-orange-500 mt-1">
                ↑ Change location or pick a different time below
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1"><Users size={12}/> Attendees</span>
            </label>
            <input
              type="number"
              name="attendees"
              value={form.attendees}
              onChange={handleChange}
              className={inputClass}
              min="1"
              required
            />
          </div>
        </div>

        {/* Row 3 — Date + Start Time + End Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1"><CalendarDays size={12}/> Date</span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputClass}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1"><Clock size={12}/> Start Time</span>
            </label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className={`${inputClass} ${conflict ? 'border-orange-400 ring-2 ring-orange-200' : ''}`}
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1"><Clock size={12}/> End Time</span>
            </label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className={`${inputClass} ${conflict ? 'border-orange-400 ring-2 ring-orange-200' : ''}`}
              required
            />
          </div>
        </div>

        {/* Row 4 — Purpose */}
        <div className="mb-6">
          <label className={labelClass}>
            <span className="flex items-center gap-1"><Briefcase size={12}/> Purpose</span>
          </label>
          <textarea
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            placeholder="Briefly describe the purpose of this booking…"
            className={`${inputClass} h-24 resize-none`}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all"
          style={{ backgroundColor: loading ? '#36bdac99' : '#36bdac' }}
        >
          <Send size={16} />
          {loading ? 'Checking availability…' : 'Submit Booking Request'}
        </button>
      </form>
    </div>
  );
};

export default BookingRequestPage;
