import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge, OverdueBadge } from '../components/Badges';
import { Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { authFetch } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/dashboard').then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const maxCategoryCount = Math.max(...data.byCategory.map(c => c.count), 1);

  return (
    <>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of all maintenance complaints across the society</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Complaints</div>
          <div className="stat-value">{data.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Open</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>{data.byStatus.Open}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value" style={{ color: '#d97706' }}>{data.byStatus['In Progress']}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Resolved</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>{data.byStatus.Resolved}</div>
        </div>
        <div className="stat-card" style={{ borderColor: data.overdueCount > 0 ? '#fbcfe8' : undefined }}>
          <div className="stat-label">Overdue</div>
          <div className="stat-value" style={{ color: '#db2777' }}>{data.overdueCount}</div>
          {data.overdueCount > 0 && <div className="stat-sub"><Clock/> Needs attention</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Complaints by Category</h3>
          {data.byCategory.map(c => (
            <div key={c.category} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span>{c.category}</span>
                <strong>{c.count}</strong>
              </div>
              <div style={{ height: '6px', background: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(c.count / maxCategoryCount) * 100}%`,
                  background: 'var(--primary)',
                  borderRadius: '3px'
                }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Complaints by Priority</h3>
          {['High', 'Medium', 'Low'].map(p => (
            <div key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
              <PriorityBadge priority={p} />
              <strong style={{ fontSize: '15px' }}>{data.byPriority[p]}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Active Complaints (Overdue First)</h3>
          <Link to="/admin/complaints" style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
        </div>
        {data.recentComplaints.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No active complaints. All caught up! 🎉</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Title</th><th>Resident</th><th>Status</th><th>Priority</th><th></th></tr>
              </thead>
              <tbody>
                {data.recentComplaints.map(c => (
                  <tr key={c._id} className={c.isOverdue ? 'overdue-row' : ''}>
                    <td>{c.title}{c.isOverdue && <span style={{ marginLeft: 8 }}><OverdueBadge /></span>}</td>
                    <td>{c.resident?.name} {c.resident?.apartmentNumber ? `(${c.resident.apartmentNumber})` : ''}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td><PriorityBadge priority={c.priority} /></td>
                    <td><Link to={`/admin/complaints/${c._id}`} className="btn btn-ghost btn-sm">View →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
