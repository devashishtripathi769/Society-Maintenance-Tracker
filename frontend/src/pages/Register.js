import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Building2,
  User,
  Mail,
  Phone,
  Home,
  Lock,
  UserPlus,
} from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    apartmentNumber: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const update =
    (key) =>
    (e) =>
      setForm({
        ...form,
        [key]: e.target.value,
      });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <Building2 size={42} className="auth-logo-icon" />
          <h1>Community Hub</h1>
          <p>Smart Society Management System</p>
        </div>

        <div className="auth-title">
          Create Your Account
        </div>

        <div className="auth-sub">
          Register as a resident to submit complaints, receive notices and stay
          connected with your community.
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">
              Full Name
            </label>

            <div className="input-group">
              <User size={18} />
              <input
                className="form-input"
                placeholder="Enter your full name"
                value={form.name}
                onChange={update("name")}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Email Address
            </label>

            <div className="input-group">
              <Mail size={18} />
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={update("email")}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Apartment Number
            </label>

            <div className="input-group">
              <Home size={18} />
              <input
                className="form-input"
                placeholder="e.g. A-204"
                value={form.apartmentNumber}
                onChange={update("apartmentNumber")}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Phone Number
            </label>

            <div className="input-group">
              <Phone size={18} />
              <input
                className="form-input"
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={update("phone")}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>

            <div className="input-group">
              <Lock size={18} />
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={update("password")}
                minLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            <UserPlus size={18} />

            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}