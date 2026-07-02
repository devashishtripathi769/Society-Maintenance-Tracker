import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminSettings() {
  const { authFetch } = useAuth();
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    authFetch('/complaints/settings/overdue-threshold')
      .then(d => setDays(d.days))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await authFetch('/complaints/settings/overdue-threshold', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days })
      });
      setSuccess('Overdue threshold updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure how the system behaves</p>
      </div>

      <div className="card" style={{ maxWidth: '480px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Overdue Threshold</h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Complaints that remain Open or In Progress past this many days are automatically flagged as overdue and surfaced at the top of the complaints list.
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Number of days</label>
            <input
              type="number"
              min="1"
              className="form-input"
              value={days}
              onChange={e => setDays(e.target.value)}
              style={{ maxWidth: '120px' }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Setting'}
          </button>
        </form>
      </div>
    </>
  );
}
