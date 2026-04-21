import React, { useEffect, useState, useCallback } from 'react';
import {
  CalendarDays, Clock, MapPin, Users,
  RefreshCw, AlertCircle, XCircle, ChevronDown, ChevronUp, BadgeInfo
} from 'lucide-react';

const API = 'http://localhost:8080/api/bookings';

const statusStyle = {
  PENDING:   { bg: '#FFF8E1', text: '#B45309', label: 'Pending'   },
  APPROVED:  { bg: '#E8FFF5', text: '#065F46', label: 'Approved'  },
  REJECTED:  { bg: '#FEF2F2', text: '#991B1B', label: 'Rejected'  },
  CANCELLED: { bg: '#F3F4F6', text: '#374151', label: 'Cancelled' },
};

const StatusBadge = ({ status }) => {
  const s = statusStyle[status] || statusStyle.PENDING;
  return (
    <span className="px-3 py-1 rounded-full text-xs font-bold"
      style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
};

/* ── Single booking card ───────────────────────────────────────────── */
const BookingCard = ({ b, onCancel, cancelling }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
      {/* Main row */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* ID chips + status */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="font-mono text-xs font-bold text-[#36bdac] bg-[#dafff7] px-2 py-0.5 rounded">
              {b.id}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <BadgeInfo size={12}/> {b.studentId || '—'}
            </span>
            <StatusBadge status={b.status} />
          </div>

          {/* Core details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-sm text-gray-500">
            <span className="flex items-center gap-1"><MapPin size={13}/> {b.location || 'N/A'}</span>
            <span className="flex items-center gap-1"><CalendarDays size={13}/> {b.date || '—'}</span>
            <span className="flex items-center gap-1"><Clock size={13}/> {b.startTime} – {b.endTime}</span>
            <span className="flex items-center gap-1"><Users size={13}/> {b.attendees} attendee{b.attendees !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Expand toggle */}
          <button onClick={() => setExpanded(v => !v)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 transition"
            title="Show details">
            {expanded ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
          </button>

          {/* Cancel — only for APPROVED */}
          {b.status === 'APPROVED' && (
            <button onClick={() => onCancel(b.id)} disabled={cancelling === b.id}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50">
              <XCircle size={15}/>
              {cancelling === b.id ? 'Cancelling…' : 'Cancel'}
            </button>
          )}
        </div>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 bg-[#dafff7]/20 rounded-b-2xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-[#010101]">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Resource ID</p>
              <p>#{b.resourceId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Purpose</p>
              <p>{b.purpose || '—'}</p>
            </div>
            {b.rejectionReason && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Rejection Reason</p>
                <p className="text-red-600">{b.rejectionReason}</p>
              </div>
            )}
            {b.createdAt && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Submitted</p>
                <p>{new Date(b.createdAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Main page ─────────────────────────────────────────────────────── */
const MyBookings = () => {
  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [cancelling,   setCancelling]   = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      const res  = await fetch(`${API}?${params}`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load bookings. Ensure the server is running on port 8080.');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      const res = await fetch(`${API}/${id}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      if (res.ok) fetchBookings();
      else { const d = await res.json(); alert(d.error || 'Could not cancel.'); }
    } catch { alert('Server error. Please try again.'); }
    finally { setCancelling(null); }
  };

  // Summary counts
  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1; return acc;
  }, {});

  const stats = [
    { label: 'Total',    value: bookings.length,       bg: '#dafff7', border: '#36bdac' },
    { label: 'Pending',  value: counts.PENDING  || 0,  bg: '#FFF8E1', border: '#F59E0B' },
    { label: 'Approved', value: counts.APPROVED || 0,  bg: '#E8FFF5', border: '#10B981' },
    { label: 'Rejected', value: counts.REJECTED || 0,  bg: '#FEF2F2', border: '#EF4444' },
  ];

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#010101]">Bookings</h2>
          <p className="text-sm text-gray-500 mt-1">All submitted booking requests</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#36bdac] bg-white text-[#010101]">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button onClick={fetchBookings}
            className="p-2 rounded-lg border border-gray-200 hover:bg-[#dafff7] transition" title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin text-[#36bdac]' : 'text-gray-500'}/>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-4 border"
            style={{ backgroundColor: s.bg, borderColor: s.border }}>
            <p className="text-xs font-semibold text-gray-500 uppercase">{s.label}</p>
            <p className="text-3xl font-bold text-[#010101] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle size={16}/> {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100"/>)}
        </div>
      )}

      {/* Booking cards */}
      {!loading && !error && (
        bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <CalendarDays size={40} className="mb-3 opacity-30"/>
            <p className="text-sm">No bookings found{filterStatus ? ` with status "${filterStatus}"` : ''}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <BookingCard key={b.id} b={b} onCancel={handleCancel} cancelling={cancelling}/>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MyBookings;
