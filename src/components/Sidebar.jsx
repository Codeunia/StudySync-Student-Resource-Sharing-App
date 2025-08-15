import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

// --- Import Icons ---
import { FaCode } from 'react-icons/fa';
import { IoMdCodeDownload } from 'react-icons/io';
import { IoHomeOutline } from 'react-icons/io5';
import { GrResources } from 'react-icons/gr';
import { CgProfile } from 'react-icons/cg';
import { IoLogOutOutline } from 'react-icons/io5'; // <= ADD LOGOUT ICON

// The component now accepts the 'user' prop from App.jsx
const Sidebar = ({ user, collapsed, setCollapsed }) => {
  const location = useLocation();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Reload the page to reset the app state
    window.location.href = '/';
  };

  const navItems = [
    { label: 'Feed', path: '/', icon: <IoHomeOutline /> },
    { label: 'Resources', path: '/resources', icon: <GrResources /> },
    { label: 'Profile', path: '/profile', icon: <CgProfile /> },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      {/* This top section can still expand/collapse the sidebar */}
      <div className="logo" onClick={() => setCollapsed(!collapsed)}>
        {!collapsed ? <FaCode /> : <IoMdCodeDownload />}
        {!collapsed && <span className="logo-text">StudySync</span>}
      </div>

      <nav className="nav-menu">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${
              location.pathname === item.path ? 'active' : ''
            }`}
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-text">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* --- ADD THIS USER PROFILE & LOGOUT SECTION --- */}
      <div className="sidebar-footer">
        {/* Updated logout button to handle token-based auth */}
        <button
          onClick={handleLogout}
          className="nav-link logout-btn"
          title={collapsed ? 'Logout' : ''}
          style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
        >
          <span className="nav-icon">
            <IoLogOutOutline />
          </span>
          {!collapsed && <span className="nav-text">Logout</span>}
        </button>

        {/* Display the logged-in user's information */}
        <div className="user-profile-section">
          <img
            src={user.image} // Use the user's Google profile picture
            alt="User Avatar"
            className="user-avatar"
          />
          {!collapsed && (
            <div className="user-details">
              <span className="user-name">{user.displayName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;