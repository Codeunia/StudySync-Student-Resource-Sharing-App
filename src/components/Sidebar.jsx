import React from 'react';

import '../styles/sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { FaCode } from "react-icons/fa";
import { IoMdCodeDownload } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { GrResources } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";




const Sidebar = ({ collapsed, setCollapsed }) => {
	 // Start collapsed
	const location = useLocation();

	const navItems = [
		{ label: 'Feed', path: '/', icon: <IoHomeOutline /> },
		{ label: 'Resources', path: '/resources', icon: <GrResources /> },
		{ label: 'Profile', path: '/profile', icon: <CgProfile /> },
	];




	return (
		<div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`} onClick={() => setCollapsed(!collapsed)} >
			<div className="logo" onClick={() => setCollapsed(!collapsed)}>
				{!collapsed? <FaCode />: <IoMdCodeDownload />}
				{!collapsed &&  <span className="logo-text">StudySync</span>}
			</div>

			<nav className="nav-menu">
				{navItems.map(item => (
					<Link
						key={item.path}
						to={item.path}
						className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
						title={collapsed ? item.label : ''}
                        onClick={(e) => { e.stopPropagation(); }} // to not collapse sidebar on click
					>
						<span className="nav-icon">{item.icon}</span>
						{!collapsed && (
							<span className="nav-text">{item.label}</span>
						)}
					</Link>
				))}
			</nav>

			{/* <div className="sidebar-footer"> */}
				{/*  implemet some thing like setting or somehting similar maybe*/}
			{/* </div> */}
		</div>
	);
};

export default Sidebar;
