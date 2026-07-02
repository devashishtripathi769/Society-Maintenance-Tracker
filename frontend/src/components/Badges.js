import React from 'react';

export function StatusBadge({ status }) {
  const map = {
    'Open': 'badge-open',
    'In Progress': 'badge-inprogress',
    'Resolved': 'badge-resolved'
  };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
}

export function PriorityBadge({ priority }) {
  const map = {
    'High': 'badge-high',
    'Medium': 'badge-medium',
    'Low': 'badge-low'
  };
  return <span className={`badge ${map[priority] || ''}`}>{priority}</span>;
}

export function OverdueBadge() {
  return <span className="overdue-badge">⏰ Overdue</span>;
}
