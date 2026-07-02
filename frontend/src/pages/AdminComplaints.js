import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge, OverdueBadge } from '../components/Badges';
import { Search } from 'lucide-react';

const CATEGORIES = ['Plumbing', 'Electrical', 'Elevator', 'Security', 'Cleaning', 'Parking', 'Noise', 'Internet', 'Other'];

export default function AdminComplaints() {
  const { authFetch } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', status: '', priority: '', search: '', startDate: '', endDate: '' });

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    authFetch(`/complaints?${params.toString()}`).then(setComplaints).finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const update = (key) => (e) => setFilters({ ...filters, [key]: e.target.value });
  const clearFilters = () => setFilters({ category: '', status: '', priority: '', search: '', startDate: '', endDate: '' });

  const overdueCount = complaints.filter(c => c.isOverdue).length;

  return (
    <>
      <div className="page-header">
        <h1>All Complaints</h1>
        <p>{complaints.length} complaints {overdueCount > 0 && `· ${overdueCount} overdue`}</p>
      </div>

      <div className="filters-bar">
        <input className="search-input" placeholder="Search title or description..." value={filters.search} onChange={update('search')} />
        <select className="filter-select" value={filters.category} onChange={update('category')}>
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={filters.status} onChange={update('status')}>
          <option value="">All statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
        <select className="filter-select" value={filters.priority} onChange={update('priority')}>
          <option value="">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input type="date" className="filter-select" value={filters.startDate} onChange={update('startDate')} title="From date" />
        <input type="date" className="filter-select" value={filters.endDate} onChange={update('endDate')} title="To date" />
        <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear</button>
      </div>

      {loading ? (
        <div className="card"><div className="spinner" style={{ margin: '20px auto' }} /></div>
      ) : complaints.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon"><Search /></div>
            <h3>No complaints found</h3>
            <p>Try adjusting your filters</p>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Resident</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Raised on</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id} className={c.isOverdue ? 'overdue-row' : ''}>
                    <td>
                      <strong>{c.title}</strong>
                      {c.isOverdue && <div style={{ marginTop: 4 }}><OverdueBadge /></div>}
                    </td>
                    <td>{c.resident?.name} {c.resident?.apartmentNumber ? `(${c.resident.apartmentNumber})` : ''}</td>
                    <td>{c.category}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td><PriorityBadge priority={c.priority} /></td>
                    <td>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td><Link to={`/admin/complaints/${c._id}`} className="btn btn-ghost btn-sm">View →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
