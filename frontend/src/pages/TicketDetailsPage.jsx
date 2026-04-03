import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Clock, User, Tag, Paperclip, Eye, Mail, Phone, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import api from '../api/axiosConfig';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const { role } = useOutletContext();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const pdfRef = useRef();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketRes, commentsRes] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/comments/ticket/${id}`)
      ]);
      setTicket(ticketRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post('/comments', {
        ticketId: id,
        content: newComment,
        author: role === 'student' ? 'StudentUser' : 'TechUser'
      });
      setNewComment('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ PDF DOWNLOAD FUNCTION
  const handleDownloadPDF = () => {
    const pdf = new jsPDF();

    let y = 10;

    // Title
    pdf.setFontSize(18);
    pdf.text("Ticket Details Report", 14, y);

    y += 10;

    // Ticket Info
    pdf.setFontSize(12);
    pdf.text(`Ticket ID: ${id}`, 14, y);
    y += 8;

    pdf.text(`Title: ${ticket.title}`, 14, y);
    y += 8;

    pdf.text(`Category: ${ticket.category}`, 14, y);
    y += 8;

    pdf.text(`Priority: ${ticket.priority}`, 14, y);
    y += 8;

    pdf.text(`Status: ${ticket.status}`, 14, y);
    y += 8;

    pdf.text(`Created By: ${ticket.createdBy}`, 14, y);
    y += 8;

    pdf.text(`Created At: ${new Date(ticket.createdAt).toLocaleString()}`, 14, y);
    y += 10;

    // Contact Info
    if (ticket.email) {
      pdf.text(`Email: ${ticket.email}`, 14, y);
      y += 8;
    }

    if (ticket.phoneNumber) {
      pdf.text(`Phone: ${ticket.phoneNumber}`, 14, y);
      y += 8;
    }

    if (ticket.incidentDate) {
      pdf.text(`Incident Date: ${ticket.incidentDate}`, 14, y);
      y += 10;
    }

    // Description
    pdf.setFontSize(14);
    pdf.text("Description:", 14, y);
    y += 8;

    pdf.setFontSize(11);
    const descLines = pdf.splitTextToSize(ticket.description, 180);
    pdf.text(descLines, 14, y);
    y += descLines.length * 6;

    // Resolution
    if (ticket.resolutionNotes) {
      y += 10;
      pdf.setFontSize(14);
      pdf.text("Resolution Notes:", 14, y);
      y += 8;

      pdf.setFontSize(11);
      const resLines = pdf.splitTextToSize(ticket.resolutionNotes, 180);
      pdf.text(resLines, 14, y);
      y += resLines.length * 6;
    }

    // Comments
    if (comments.length > 0) {
      y += 10;
      pdf.setFontSize(14);
      pdf.text("Comments:", 14, y);
      y += 8;

      pdf.setFontSize(11);

      comments.forEach((c, index) => {
        const commentText = `${c.author} (${new Date(c.createdAt).toLocaleString()}): ${c.content}`;
        const lines = pdf.splitTextToSize(commentText, 180);

        if (y + lines.length * 6 > 280) {
          pdf.addPage();
          y = 10;
        }

        pdf.text(lines, 14, y);
        y += lines.length * 6 + 4;
      });
    }

    // Save
    pdf.save(`ticket-${id}.pdf`);
  };

  if (loading) return <div className="p-12 text-center">Loading ticket details...</div>;
  if (!ticket) return <div className="p-12 text-center text-red-500">Ticket not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <Link
          to={`/${role}`}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Tickets
        </Link>

        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
        >
          Download PDF
        </button>
      </div>

      {/* 📄 Ticket Content (Captured for PDF) */}
      <div ref={pdfRef} className="glass-card p-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Tag size={16}/> {ticket.category}</span>
              <span className="flex items-center gap-1"><Clock size={16}/> {new Date(ticket.createdAt).toLocaleString()}</span>
              <span className="flex items-center gap-1"><User size={16}/> {ticket.createdBy}</span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
              {ticket.email && <span className="flex items-center gap-1"><Mail size={16}/> {ticket.email}</span>}
              {ticket.phoneNumber && <span className="flex items-center gap-1"><Phone size={16}/> {ticket.phoneNumber}</span>}
              {ticket.incidentDate && <span className="flex items-center gap-1"><Calendar size={16}/> {ticket.incidentDate}</span>}
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium mr-2">{ticket.priority}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{ticket.status}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border mb-6">
          <p>{ticket.description}</p>
        </div>

        {/* Attachments */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Paperclip size={18}/> Attachments
            </h3>

            <div className="flex gap-4 overflow-x-auto">
              {ticket.attachments.map((url, idx) => (
                <img key={idx} src={url} alt="attachment" className="w-32 h-32 object-cover rounded-lg border"/>
              ))}
            </div>
          </div>
        )}

        {/* Resolution */}
        {ticket.resolutionNotes && (
          <div className="bg-emerald-50 border p-4 rounded-lg">
            <h3 className="font-semibold text-emerald-800">Resolution Notes</h3>
            <p className="text-emerald-700">{ticket.resolutionNotes}</p>
          </div>
        )}
      </div>

      {/* 💬 Discussion Section */}
      <div className="glass-card">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <MessageSquare size={20}/> Discussion
        </h3>

        <div className="space-y-6 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {comment.author.charAt(0)}
              </div>

              <div className="flex-1 bg-gray-50 rounded-2xl p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold">{comment.author}</span>
                  <span className="text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <form onSubmit={handleAddComment} className="flex gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="input-field flex-1"
            rows={2}
            placeholder="Type your message..."
          />
          <button className="btn-primary">Post</button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetailsPage;