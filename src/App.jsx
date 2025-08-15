// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Resources from './pages/Resources';

import { authAPI } from './utils/api';
import LoginPage from './pages/LoginPage';
import './styles/pages.css';
import './styles/sidebar.css';
import './styles/profile.css';

function App() {
  const [collapsed, setCollapsed] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        // First, check if user data is in URL (from OAuth callback)
        const urlParams = new URLSearchParams(window.location.search);
        const userParam = urlParams.get('user');
        
        if (userParam) {
          // User data from OAuth callback
          const userData = JSON.parse(decodeURIComponent(userParam));
          setUser(userData);
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          // Try to get user from localStorage first
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Try to get user from session
            const currentUser = await authAPI.getCurrentUser();
            setUser(currentUser);
            localStorage.setItem('user', JSON.stringify(currentUser));
          }
        }
      } catch (error) {
        console.log('Auth check failed:', error.message);
        // Clear stored user on auth failure
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkCurrentUser();
  }, []);

  const sidebarWidth = collapsed ? 60 : 250;

  if (loading) {
    return <div className="loading-message">Loading Application...</div>;
  }

  return (
    <Router>
      {!user ? (
        <LoginPage />
      ) : (
        <div className="app-layout">
          <Sidebar user={user} collapsed={collapsed} setCollapsed={setCollapsed} />
          <main
            className="main-area"
            style={{ marginLeft: `${sidebarWidth}px` }}
          >
            <Routes>
              <Route path="/" element={<Feed user={user} />} />
              <Route path="/dashboard" element={<Feed user={user} />} />
              <Route path="/resources" element={<Resources user={user} />} />
              <Route path="/profile" element={<Profile user={user} />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;