import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  ClipboardPlus,
  ClipboardList,
  Bell,
  LayoutDashboard,
  Clock3,
  ArrowRight,
  ShieldCheck,
  Users,
  CheckCircle2,
} from "lucide-react";

const FEATURES = [
  {
    icon: ClipboardPlus,
    title: "Complaint Management",
    text: "Residents can raise maintenance requests with category, description and priority.",
  },
  {
    icon: ClipboardList,
    title: "Complaint Tracking",
    text: "Track every complaint from submission to resolution with complete status history.",
  },
  {
    icon: Bell,
    title: "Notice Board",
    text: "Share important announcements and updates with every resident instantly.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    text: "Manage complaints, notices and residents from a centralized dashboard.",
  },
  {
    icon: Clock3,
    title: "Status Monitoring",
    text: "Monitor pending, in-progress and resolved complaints in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Access",
    text: "Role-based authentication ensures secure access for residents and administrators.",
  },
  {
  icon: CheckCircle2,
  title: "Resolution History",
  text: "Maintain a complete record of resolved complaints, including resolution details and timestamps for future reference.",
},
{
  icon: Users,
  title: "Resident Management",
  text: "Manage resident information, apartment details, and user roles from a centralized administration panel.",
},
];

const STEPS = [
  {
    num: "01",
    title: "Raise",
    text: "Resident submits a complaint with category, description, and an optional photo.",
  },
  {
    num: "02",
    title: "Triage",
    text: "Admin sets a priority and works it through Open → In Progress → Resolved.",
  },
  {
    num: "03",
    title: "Resolve",
    text: "Resident gets notified by email at every step until the issue is closed.",
  },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Nav */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <div className="landing-logo" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <div className="landing-logo-icon"><Building2 size={30}  /></div>
              <div style={{ fontSize: "18px", margin: "0 0 0 10px" }}>Community Hub</div>
            </div>
          </div>
          <nav className="landing-nav-links">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">
            Smart Society
            <br />
            Maintenance Management
          </h1>

          <p className="hero-sub">
            A centralized platform for residents and administrators to manage
            maintenance complaints, notices and community communication with
            ease.
          </p>
          <div className="hero-cta">
            <Link
              to="/register"
              className="btn btn-primary"
              style={{ padding: "11px 22px", fontSize: "14px" }}
            >
              Create your account
            </Link>
            <Link
              to="/login"
              className="btn btn-secondary"
              style={{ padding: "11px 22px", fontSize: "14px" }}
            >
              I already have one
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <Users size={18} />
              <strong>Residents</strong>
              <span>Community Portal</span>
            </div>

            <div>
              <ClipboardList size={18} />
              <strong>Complaints</strong>
              <span>Status Tracking</span>
            </div>

            <div>
              <Bell size={18} />
              <strong>Notices</strong>
              <span>Instant Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">
            Everything a society needs, nothing it doesn't
          </h2>
          <p className="section-sub">
            A focused workflow for residents and admins — built around the
            actual lifecycle of a maintenance complaint.
          </p>
          <div className="feature-grid">
            {FEATURES.map((f) => {
              const Icon = f.icon;

              return (
                <div className="feature-card" key={f.title}>
                  <div className="feature-icon">
                    <Icon size={26} />
                  </div>

                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section-alt">
        <div className="section-inner">
          <h2 className="section-title">How it works</h2>
          <p className="section-sub">
            From a leaking pipe to a resolved ticket, in three steps.
          </p>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div className="step-card" key={s.num}>
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="cta-band-inner">
          <h2>Ready to stop tracking complaints in a notebook?</h2>
          <p>Set it up for your society in a few minutes.</p>
          <Link
            to="/register"
            className="btn btn-primary"
            style={{ padding: "11px 22px", fontSize: "14px" }}
          >
            Create your account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <div className="landing-logo" style={{ color: "white" }}>
              <div className="landing-logo">
                <div className="landing-logo">
                  <Building2 size={30} style={{ color: "white" }} />
                  <span style={{ color: "white", fontSize: "18px" }}>Community Hub</span>
                </div>
              </div>
            </div>
            <p>
              A simple, focused maintenance tracker for apartment societies.
            </p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="mailto:support@communityhub.app">Contact support</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Community Hub. Built for apartment
          societies everywhere.
        </div>
      </footer>
    </div>
  );
}
