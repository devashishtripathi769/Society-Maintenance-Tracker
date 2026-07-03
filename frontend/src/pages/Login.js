import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building2, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
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
          Welcome Back
        </div>

        <div className="auth-sub">
          Sign in to access your society dashboard and manage complaints,
          notices and community updates.
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">
              Email Address
            </label>

            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            <LogIn size={18} />

            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="demo-credentials">
  <h4>Demo Credentials</h4>

  <div className="demo-box">
    <strong>Admin Login</strong>
    <p>Email: devashishtripathi768@gmail.com</p>
    <p>Password: vashu2a</p>
  </div>

  <div className="demo-box">
    <strong>Resident Login</strong>
    <p>Email: devashishtripathi769@gmail.com</p>
    <p>Password: devanu13</p>
  </div>
</div>
        <div className="auth-footer">
          Don't have an account?
          <Link to="/register">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}
