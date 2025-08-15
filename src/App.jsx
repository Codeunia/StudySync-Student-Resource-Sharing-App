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
        const currentUser = await authAPI.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
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