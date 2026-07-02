import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pin } from 'lucide-react';

export default function NoticeBoardPage() {
  const { authFetch } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/notices').then(setNotices).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <h1>Notice Board</h1>
        <p>Announcements and updates from the society admin</p>
      </div>

      {notices.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon"><Pin /></div>
            <h3>No notices yet</h3>
            <p>Check back later for society updates</p>
          </div>
        </div>
      ) : (
        notices.map(n => (
          <div key={n._id} className={`notice-card ${n.isImportant ? 'important' : ''}`}>
            <div className="notice-title">
              {n.isImportant && <span className="badge badge-important"><Pin/> Important</span>}
              {n.title}
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
