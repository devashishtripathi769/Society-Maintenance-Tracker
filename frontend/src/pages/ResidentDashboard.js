import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { StatusBadge, PriorityBadge, OverdueBadge } from "../components/Badges";
import {
  LayoutDashboard,
  ClipboardList,
  CircleAlert,
  Clock3,
  CheckCircle2,
  Bell,
  Plus,
  ArrowRight,
  Inbox,
  Pin,
} from "lucide-react";

export default function ResidentDashboard() {
  const { authFetch, user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([authFetch("/complaints/my"), authFetch("/notices")])
      .then(([c, n]) => {
        setComplaints(c);
        setNotices(n.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "Open").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <LayoutDashboard size={32} />

          <div>
            <h1>Welcome, {user?.name?.split(" ")[0]}</h1>
            <p>
              Here's an overview of your maintenance requests and community
              updates.
            </p>
          </div>
        </div>
        <p>Here's an overview of your complaints and society updates</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Complaints</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Open</div>
            <div className="stat-value text-danger">{stats.open}</div>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">In Progress</div>
            <div className="stat-value text-warning">{stats.inProgress}</div>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Resolved</div>
            <div className="stat-value text-success">{stats.resolved}</div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "20px",
        }}
      >
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>
              Recent Complaints
            </h3>
            <Link
              to="/my-complaints"
              style={{
                fontSize: "12.5px",
                color: "var(--primary)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View all →
            </Link>
          </div>
          {complaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <ClipboardList />
              </div>
              <h3>No complaints yet</h3>
              <p>Raise your first complaint to get started</p>
              <Link
                to="/raise-complaint"
                className="btn btn-primary"
                style={{ marginTop: "16px" }}
              >
                + Raise Complaint
              </Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.slice(0, 5).map((c) => (
                    <tr
                      key={c._id}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        (window.location.href = `/complaints/${c._id}`)
                      }
                    >
                      <td>
                        {c.title}
                        {c.isOverdue && (
                          <span style={{ marginLeft: 8 }}>
                            <OverdueBadge />
                          </span>
                        )}
                      </td>
                      <td>{c.category}</td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td>
                        <PriorityBadge priority={c.priority} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Notice Board</h3>
            <Link
              to="/notices"
              style={{
                fontSize: "12.5px",
                color: "var(--primary)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View all →
            </Link>
          </div>
          {notices.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              No notices posted yet.
            </p>
          ) : (
            notices.map((n) => (
              <div
                key={n._id}
                style={{
                  paddingBottom: "14px",
                  marginBottom: "14px",
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {n.isImportant && <Pin />} {n.title}
                </div>
                <p
                  style={{
                    fontSize: "12.5px",
                    color: "var(--text-muted)",
                    marginTop: "4px",
                  }}
                >
                  {n.content.length > 80
                    ? n.content.slice(0, 80) + "..."
                    : n.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
