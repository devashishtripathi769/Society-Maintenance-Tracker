import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge, OverdueBadge } from '../components/Badges';

const STATUS_ICONS = { 'Open': '🔴', 'In Progress': '🟡', 'Resolved': '🟢' };

export default function ComplaintDetail() {
  const { id } = useParams();
  const { authFetch, user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API = process.env.REACT_APP_API_URL || '/api';
  const isAdmin = user?.role === 'admin';

  const load = () => {
    authFetch(`/complaints/${id}`).then(c => {
      setComplaint(c);
      setNewStatus(c.status);
      setPriority(c.priority);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);
    try {
      const body = {};
      if (newStatus !== complaint.status) body.status = newStatus;
      if (priority !== complaint.priority) body.priority = priority;
      if (note) body.note = note;

      const updated = await authFetch(`/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      setComplaint(updated);
      setNote('');
      setSuccess('Complaint updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!complaint) return <div className="card">Complaint not found</div>;

  const backLink = isAdmin ? '/admin/complaints' : '/my-complaints';

  return (
    <>
      <div className="page-header">
        <Link to={backLink} style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-block', marginBottom: '8px' }}>← Back to complaints</Link>
        <h1>{complaint.title}</h1>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
          {complaint.isOverdue && <OverdueBadge />}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1.3fr 1fr' : '1fr', gap: '20px' }}>
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '13.5px', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Category</span>
              <span>{complaint.category}</span>
              <span style={{ color: 'var(--text-muted)' }}>Raised by</span>
              <span>{complaint.resident?.name} {complaint.resident?.apartmentNumber ? `(${complaint.resident.apartmentNumber})` : ''}</span>
              <span style={{ color: 'var(--text-muted)' }}>Raised on</span>
              <span>{new Date(complaint.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              {complaint.resolvedAt && (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>Resolved on</span>
                  <span>{new Date(complaint.resolvedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </>
              )}
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.6, background: 'var(--bg)', padding: '12px', borderRadius: '8px' }}>
              {complaint.description}
            </p>
            {complaint.photo && (
              <div style={{ marginTop: '16px' }}>
                <img
  src={complaint.photo}
  alt="Complaint"
  style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid var(--border)' }}
/>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Status History</h3>
            <div className="history-timeline">
              {complaint.statusHistory.map((h, idx) => (
                <div className="history-item" key={idx}>
                  <div className="history-dot">{STATUS_ICONS[h.status]}</div>
                  <div className="history-content">
                    <div className="history-status">{h.status}</div>
                    <div className="history-meta">
                      by {h.changedBy?.name || 'System'} ({h.changedBy?.role || ''}) · {new Date(h.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {h.note && <div className="history-note">{h.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="card" style={{ alignSelf: 'flex-start' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Update Complaint</h3>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {complaint.status === 'Resolved' ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>This complaint has been resolved and closed.</p>
            ) : (
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Note (optional)</label>
                  <textarea
                    className="form-textarea"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Add a note about this update..."
                    rows={3}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={updating}>
                  {updating ? 'Updating...' : 'Save Update'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
}
