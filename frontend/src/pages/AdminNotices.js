import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pin } from 'lucide-react';

export default function AdminNotices() {
  const { authFetch } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    authFetch('/notices').then(setNotices).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await authFetch('/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, isImportant })
      });
      setTitle(''); setContent(''); setIsImportant(false);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    await authFetch(`/notices/${id}`, { method: 'DELETE' });
    load();
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Notice Board</h1>
          <p>Post announcements visible to all residents</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Post Notice'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px', maxWidth: '560px' }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Water supply maintenance on Sunday" required />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea className="form-textarea" value={content} onChange={e => setContent(e.target.value)} placeholder="Details about the notice..." required rows={4} />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', cursor: 'pointer' }}>
                <input type="checkbox" checked={isImportant} onChange={e => setIsImportant(e.target.checked)} />
                Mark as important (pins to top + emails all residents)
              </label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Notice'}
            </button>
          </form>
        </div>
      )}

      {notices.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon"><Pin /></div>
            <h3>No notices posted yet</h3>
            <p>Post your first notice to keep residents informed</p>
          </div>
        </div>
      ) : (
        notices.map(n => (
          <div key={n._id} className={`notice-card ${n.isImportant ? 'important' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="notice-title">
                {n.isImportant && <span className="badge badge-important"><Pin /></span>}
                {n.title}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(n._id)} style={{ color: 'var(--danger)' }}>Delete</button>
            </div>
            <div className="notice-body">{n.content}</div>
            <div className="notice-footer">
              <span>Posted by {n.postedBy?.name}</span>
              <span>{new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))
      )}
    </>
  );
}
