import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ClipboardList,
  Plus,
  Eye,
  Filter,
  Inbox,
} from "lucide-react";
import {
  StatusBadge,
  PriorityBadge,
  OverdueBadge,
} from "../components/Badges";

export default function MyComplaints() {
  const { authFetch } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    authFetch("/complaints/my")
      .then(setComplaints)
      .finally(() => setLoading(false));
  }, []);

  const filtered = statusFilter
    ? complaints.filter((c) => c.status === statusFilter)
    : complaints;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <ClipboardList size={32} />
          <div>
            <h1>My Complaints</h1>
            <p>
              View, monitor and track all maintenance requests submitted by you.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <Filter size={18} />

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <Link to="/raise-complaint" className="btn btn-primary">
          <Plus size={18} />
          Raise Complaint
        </Link>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Inbox size={60} className="empty-icon" />

            <h3>No Complaints Found</h3>

            <p>
              {statusFilter
                ? "No complaints match the selected status."
                : "You haven't submitted any maintenance requests yet."}
            </p>

            {!statusFilter && (
              <Link to="/raise-complaint" className="btn btn-primary">
                <Plus size={18} />
                Raise Complaint
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="card complaint-table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((complaint) => (
                  <tr
                    key={complaint._id}
                    className={complaint.isOverdue ? "overdue-row" : ""}
                  >
                    <td>
                      <strong>{complaint.title}</strong>

                      {complaint.isOverdue && (
                        <div className="overdue-badge-wrapper">
                          <OverdueBadge />
                        </div>
                      )}
                    </td>

                    <td>{complaint.category}</td>

                    <td>
                      <StatusBadge status={complaint.status} />
                    </td>

                    <td>
                      <PriorityBadge priority={complaint.priority} />
                    </td>

                    <td>
                      {new Date(complaint.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>

                    <td>
                      <Link
                        to={`/complaints/${complaint._id}`}
                        className="btn btn-ghost btn-sm"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
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