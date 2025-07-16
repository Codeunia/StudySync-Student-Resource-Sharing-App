import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import './styles/pages.css';
import './styles/sidebar.css';


function App() {
	const [collapsed, setCollapsed] = useState(true);
	const sidebarWidth = collapsed ? 60 : 250;
	return (
		<Router>
			<div className="app-layout">
				<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
				<main
					className="main-area"
					style={{ marginLeft: `${sidebarWidth}px` }}
				>
					<Routes>
						<Route path="/" element={<Feed />} />
						<Route path="/resources" element={<Resources />} />
						<Route path="/profile" element={<Profile />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
