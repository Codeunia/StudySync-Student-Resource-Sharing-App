import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/bottomNavigation.css';

// --- Import Icons ---
import { IoHomeOutline } from 'react-icons/io5';
import { GrResources } from 'react-icons/gr';
import { CgProfile } from 'react-icons/cg';
import { IoLogOutOutline } from 'react-icons/io5';

const BottomNavigation = ({ user }) => {
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
		<div className="bottom-navigation">
			<div className="bottom-nav-container">
				{navItems.map(item => (
					<Link
						key={item.path}
						to={item.path}
						className={`bottom-nav-link ${
							location.pathname === item.path ? 'active' : ''
						}`}
					>
						<span className="bottom-nav-icon">{item.icon}</span>
						<span className="bottom-nav-text">{item.label}</span>
					</Link>
				))}

				<button
					onClick={handleLogout}
					className="bottom-nav-link logout-btn"
				>
					<span className="bottom-nav-icon">
						<IoLogOutOutline />
					</span>
					<span className="bottom-nav-text">Logout</span>
				</button>
			</div>

			{/* User profile section for mobile */}
			<div className="bottom-user-profile">
				<img
					src={user.image}
					alt="User Avatar"
					className="bottom-user-avatar"
				/>
				<span className="bottom-user-name">{user.displayName}</span>
			</div>
		</div>
	);
};

export default BottomNavigation;
