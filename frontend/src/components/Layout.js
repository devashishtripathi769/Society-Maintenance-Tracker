import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CirclePlus,
  ClipboardList,
  Megaphone,
  Settings,
  LogOut,
  House,
  Building2,
} from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';

  const residentLinks = [
    { to: '/dashboard', icon: House, label: 'Dashboard' },
    { to: '/raise-complaint', icon: CirclePlus, label: 'Raise Complaint' },
    { to: '/my-complaints', icon: ClipboardList, label: 'My Complaints' },
    { to: '/notices', icon: Megaphone, label: 'Notice Board' },
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/complaints', icon: ClipboardList, label: 'All Complaints' },
    { to: '/admin/notices', icon: Megaphone, label: 'Notice Board' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const links = user?.role === 'admin' ? adminLinks : residentLinks;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="landing-logo" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <div className="landing-logo-icon"><Building2 size={30}  /></div>
              <div style={{ fontSize: "18px", margin: "0 0 0 10px" }}>Community Hub</div>
            </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">Menu</div>

          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin' || link.to === '/dashboard'}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <Icon size={20} className="nav-icon" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{initials}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} className="nav-icon" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}