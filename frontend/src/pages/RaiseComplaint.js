import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera } from 'lucide-react';

const CATEGORIES = ['Plumbing', 'Electrical', 'Elevator', 'Security', 'Cleaning', 'Parking', 'Noise', 'Internet', 'Other'];

export default function RaiseComplaint() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const { token } = useAuth();
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL || '/api';

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      if (photo) formData.append('photo', photo);

      const res = await fetch(`${API}/complaints`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      navigate('/my-complaints');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Raise a Complaint</h1>
        <p>Describe the issue so the admin can resolve it quickly</p>
      </div>

      <div className="card" style={{ maxWidth: '560px' }}>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Leaking pipe in kitchen"
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} required>
              <option value="">Select a category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide details about the issue: location, when it started, severity..."
              required
              rows={5}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Photo (optional)</label>
            <div
              className={`photo-upload ${photo ? 'has-file' : ''}`}
              onClick={() => fileRef.current.click()}
            >
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
              {photoPreview ? (
                <div>
                  <img src={photoPreview} alt="Preview" className="photo-preview" />
                  <p className="form-hint">Click to change photo</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}><Camera /></div>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Click to upload a photo</p>
                  <p className="form-hint">JPG, PNG, GIF up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
