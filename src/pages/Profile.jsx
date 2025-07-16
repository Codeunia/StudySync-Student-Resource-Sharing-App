import React, { useState, useEffect, useRef } from 'react';
// import '../styles/profile.css';
import { FaEdit } from 'react-icons/fa';
import { TiTickOutline } from 'react-icons/ti';
import { MdDeleteOutline } from 'react-icons/md';

import Select from 'react-select';
import {
	postsAPI,
	resourcesAPI,
	usersAPI,
	enrichWithUserData,
	checkServerStatus,
} from '../utils/api';

const Profile = () => {
	// Initial user data (could come from props, context, or API)
	const [photo, setPhoto] = useState(null);
	const [fullName, setFullName] = useState('');
	const [role, setRole] = useState('');
	const [institution, setInstitution] = useState('');
	const [graduatingYear, setGraduatingYear] = useState('');
	const [skills, setSkills] = useState([]);
	const [skillInput, setSkillInput] = useState('');
	const [followers] = useState([]);
	const [showFollowers, setShowFollowers] = useState(false);
	const [activeSection, setActiveSection] = useState('resources');
	const [isServerRunning, setIsServerRunning] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [username, setUsername] = useState(
		fullName.toLowerCase().replace(/\s+/g, '')
	);
	const [editing, setEditing] = useState(false);
	const [editingSkills, setEditingSkills] = useState(false);
	const [resourceFile, setResourceFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	// Initialize with empty arrays - will be loaded from API
	const [myPosts, setMyPosts] = useState([]);
	const [resourcesPosted, setResourcesPosted] = useState([]);
	const handlePhotoChange = e => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setPhoto(reader.result);
				// Save profile after photo change
				setTimeout(saveUserProfile, 100);
			};
			reader.readAsDataURL(file);
		}
	};

	const years = Array.from({ length: 15 }, (_, i) => {
		const year = 2020 + i;
		return { value: year, label: year.toString() };
	});

	// Helper function to convert file to base64
	const convertFileToBase64 = file => {
		return new Promise((resolve, reject) => {
			// Check file size (limit to 10MB for base64 storage)
			const maxSize = 10 * 1024 * 1024; // 10MB
			if (file.size > maxSize) {
				reject(
					new Error(
						`File size too large. Maximum size is ${maxSize / 1024 / 1024}MB`
					)
				);
				return;
			}

			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	// Load initial data from API
	const loadData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Check if server is running
			const serverStatus = await checkServerStatus();
			setIsServerRunning(serverStatus);

			if (!serverStatus) {
				// Provide fallback data when server is not running
				console.warn('JSON Server not running, using fallback data');
				setMyPosts([
					{
						id: 1,
						content:
							'Just finished my portfolio website! Feel free to check it out.',
						link: {
							title: 'My Portfolio',
							url: 'https://myportfolio.com',
						},
						timestamp: '2025-07-10T15:00:00Z',
						likes: 34,
						comments: 6,
						author: {
							name: fullName,
							username: username,
							avatar: photo,
						},
					},
					{
						id: 2,
						content:
							'Really enjoyed building a REST API using Node.js and Express. Check out this tutorial: https://nodejs.org/en/docs/ and also www.expressjs.com for more info!',
						link: null,
						timestamp: '2025-07-07T11:30:00Z',
						likes: 20,
						comments: 2,
						author: {
							name: fullName,
							username: username,
							avatar: photo,
						},
					},
				]);

				setResourcesPosted([
					{
						id: 1,
						author: { name: fullName, username, avatar: photo },
						title: 'DSA Notes PDF',
						type: 'PDF',
						resourceFile: null,
						url: '/notes/dsa.pdf',
						description:
							'These notes helped me master linked lists and trees for my exam!',
						timestamp: '2025-07-10T12:00:00Z',
					},
					{
						id: 2,
						author: { name: fullName, username, avatar: photo },
						title: 'React Tutorial Video',
						type: 'Video',
						resourceFile: null,
						url: 'https://youtu.be/react-tutorial',
						description:
							'This walkthrough clarified hooks for me—highly recommend!',
						timestamp: '2025-07-08T09:30:00Z',
					},
				]);

				setError(
					'JSON Server is not running. Using demo data. Start the server with "npm run json-server" for data persistence.'
				);
				return;
			}

			// Load user profile data, posts and resources from API
			const currentUsername = username || 'venkatjaswanth'; // Default username

			const [userProfile, posts, resources] = await Promise.all([
				usersAPI.getByUsername(currentUsername),
				postsAPI.getByUser(currentUsername),
				resourcesAPI.getByUser(currentUsername),
			]);

			// Update profile data if user exists in database
			if (userProfile && userProfile.length > 0) {
				const user = userProfile[0];
				setFullName(user.fullName || fullName);
				setRole(user.role || role);
				setInstitution(user.institution || institution);
				setGraduatingYear(user.graduatingYear || graduatingYear);
				setSkills(user.skills || []);
				setPhoto(user.avatar || user.profilePhoto || photo); // Use avatar field
				// Update username if it's different
				if (user.username !== username) {
					setUsername(user.username);
				}
			}

			// Enrich posts and resources with user data (including avatar)
			const enrichedPosts = await enrichWithUserData(posts);
			const enrichedResources = await enrichWithUserData(resources);

			setMyPosts(enrichedPosts);
			setResourcesPosted(enrichedResources);
		} catch (err) {
			setError(`Failed to load data: ${err.message}`);
			console.error('Error loading data:', err);

			// Provide fallback data on error too
			setMyPosts([]);
			setResourcesPosted([]);
		} finally {
			setLoading(false);
		}
	};

	// Save user profile data to API
	const saveUserProfile = async () => {
		if (!isServerRunning) {
			console.warn(
				'JSON Server not running, profile changes not persisted'
			);
			return;
		}

		try {
			const currentUsername = username || 'venkatjaswanth';
			const profileData = {
				fullName,
				username: currentUsername,
				role,
				institution,
				graduatingYear,
				skills,
				photo,
				followers,
			};

			console.log('Saving profile data:', profileData); // Debug log

			// Check if user exists
			const existingUsers = await usersAPI.getByUsername(currentUsername);

			if (existingUsers && existingUsers.length > 0) {
				// Update existing user
				const userId = existingUsers[0].id;
				const updatedUser = { ...existingUsers[0], ...profileData };
				await usersAPI.update(userId, updatedUser);
				console.log(
					'Profile updated successfully for user ID:',
					userId
				);
			} else {
				// Create new user
				const newUser = { id: Date.now(), ...profileData };
				await usersAPI.create(newUser);
				console.log('New user created successfully');
			}

			console.log('Profile saved successfully');
		} catch (err) {
			console.error('Failed to save profile:', err);
		}
	};

	// State for posts
	const [newPostContent, setNewPostContent] = useState('');
	const [newPostLinkTitle, setNewPostLinkTitle] = useState('');
	const [newPostLinkURL, setNewPostLinkURL] = useState('');

	// State for resources
	const [resourceTitle, setResourceTitle] = useState('');
	const [resourceDescription, setResourceDescription] = useState('');
	const [resourceLink, setResourceLink] = useState('');
	const [isProcessingFile, setIsProcessingFile] = useState(false);

	// Share handlers
	const handleSharePost = async () => {
		if (!newPostContent.trim()) return;

		const newPost = {
			id: Date.now(), // Fallback ID for when server is not running
			content: newPostContent,
			link: newPostLinkURL
				? {
						title: newPostLinkTitle || newPostLinkURL,
						url: newPostLinkURL,
					}
				: null,
			timestamp: new Date().toISOString(),
			likes: 0,
			comments: 0,
			author: { name: fullName, username, avatar: photo },
		};

		try {
			if (isServerRunning) {
				const createdPost = await postsAPI.create(newPost);
				setMyPosts([createdPost, ...myPosts]);
			} else {
				// Fallback mode - just add to local state
				setMyPosts([newPost, ...myPosts]);
			}

			// Clear form
			setNewPostContent('');
			setNewPostLinkTitle('');
			setNewPostLinkURL('');
		} catch (err) {
			// Even if API fails, add to local state as fallback
			setMyPosts([newPost, ...myPosts]);
			setNewPostContent('');
			setNewPostLinkTitle('');
			setNewPostLinkURL('');

			console.warn(
				'Failed to save to server, added locally:',
				err.message
			);
		}
	};

	const handleShareResource = async () => {
		if (!resourceTitle.trim() || !resourceDescription.trim()) return;

		setIsProcessingFile(true); // Show loading state

		let resourceType = 'Link';
		let finalUrl = resourceLink;
		let finalFile = resourceFile;
		let fileData = null;

		// Determine type based on file or URL
		if (resourceFile) {
			if (resourceFile.type === 'application/pdf') {
				resourceType = 'PDF';
			} else if (resourceFile.type.startsWith('image/')) {
				resourceType = 'Image';
			} else {
				resourceType = 'File';
			}

			// Convert file to base64 for persistent storage
			try {
				const base64 = await convertFileToBase64(resourceFile);
				fileData = {
					name: resourceFile.name,
					type: resourceFile.type,
					size: resourceFile.size,
					data: base64,
				};
				finalUrl = base64; // Use base64 as URL for display
			} catch (error) {
				console.error('Failed to convert file to base64:', error);
				alert(`Error processing file: ${error.message}`);
				setIsProcessingFile(false);
				return; // Stop the resource creation if file processing fails
			}
		} else if (resourceLink) {
			if (resourceLink.match(/\.pdf$/i)) {
				resourceType = 'PDF';
			} else if (resourceLink.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
				resourceType = 'Image';
			} else if (resourceLink.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i)) {
				resourceType = 'Video';
			}
		}

		const newResource = {
			id: Date.now(), // Fallback ID for when server is not running
			author: { name: fullName, username, avatar: photo },
			title: resourceTitle,
			type: resourceType,
			resourceFile: fileData, // Store file data instead of File object
			url: finalUrl,
			description: resourceDescription,
			timestamp: new Date().toISOString(),
		};

		try {
			if (isServerRunning) {
				const createdResource = await resourcesAPI.create(newResource);
				setResourcesPosted([createdResource, ...resourcesPosted]);
			} else {
				// Fallback mode - just add to local state
				setResourcesPosted([newResource, ...resourcesPosted]);
			}

			// Clear form
			setResourceTitle('');
			setResourceDescription('');
			setResourceLink('');

			// Clean up preview URL
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
				setPreviewUrl(null);
			}

			setResourceFile(null);

			// Reset file input
			const fileInput = document.getElementById('pdf-upload');
			if (fileInput) fileInput.value = '';

			setIsProcessingFile(false); // Hide loading state
		} catch (err) {
			// Even if API fails, add to local state as fallback
			setResourcesPosted([newResource, ...resourcesPosted]);

			// Clear form anyway
			setResourceTitle('');
			setResourceDescription('');
			setResourceLink('');
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
				setPreviewUrl(null);
			}
			setResourceFile(null);
			const fileInput = document.getElementById('pdf-upload');
			if (fileInput) fileInput.value = '';

			console.warn(
				'Failed to save to server, added locally:',
				err.message
			);

			setIsProcessingFile(false); // Hide loading state
		}
	};

	const usernameRef = useRef(null);
	const roleRef = useRef(null);
	const autoTab = () => {
		if (usernameRef.current) {
			usernameRef.current.focus();
			return;
		} else if (!roleRef.current) {
			roleRef.current.focus();
		}
	};

	const handleEditToggle = () => {
		if (editing) {
			const autoGenerated = fullName.toLowerCase().replace(/\s+/g, '');
			if (username === autoGenerated || username.trim() === '') {
				setUsername(autoGenerated);
			}
			// Save profile data when finishing edit
			saveUserProfile();
		}
		setEditing(!editing);
	};

	const addSkill = () => {
		if (skillInput.trim() && !skills.includes(skillInput.trim())) {
			setSkills([...skills, skillInput.trim()]);
			setSkillInput('');
			// Save profile after adding skill
			setTimeout(saveUserProfile, 100); // Small delay to ensure state is updated
		}
	};

	const removeSkill = skillToRemove => {
		setSkills(skills.filter(s => s !== skillToRemove));
		// Save profile after removing skill
		setTimeout(saveUserProfile, 100); // Small delay to ensure state is updated
	};

	// Function to detect and render clickable links in text
	const renderTextWithLinks = text => {
		if (!text) return text;

		// Enhanced regex to detect various URL formats and email addresses
		const urlRegex =
			/(https?:\/\/(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w/_.])*)?(?:\?(?:[\w&=%.-])*)?(?:#(?:[\w.-])*)?|www\.(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w/_.])*)?(?:\?(?:[\w&=%.-])*)?(?:#(?:[\w.-])*)?|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
		const parts = text.split(urlRegex);

		return parts.map((part, index) => {
			if (urlRegex.test(part)) {
				let url,
					displayText = part;

				if (part.includes('@')) {
					// Handle email addresses
					url = `mailto:${part}`;
				} else if (part.startsWith('www.')) {
					// Add https:// prefix for www links
					url = `https://${part}`;
				} else {
					url = part;
				}

				return (
					<a
						key={index}
						href={url}
						target={part.includes('@') ? '_self' : '_blank'}
						rel="noopener noreferrer"
						className="inline-link"
						onClick={e => e.stopPropagation()}
						title={
							part.includes('@')
								? `Send email to ${part}`
								: `Open ${url} in new tab`
						}
					>
						{displayText}
					</a>
				);
			}
			return part;
		});
	};

	// Load data when component mounts or username changes
	useEffect(() => {
		loadData();
	}, [username]);

	// Save profile data when key fields change (debounced to avoid too many API calls)
	useEffect(() => {
		if (isServerRunning && !loading) {
			const timeoutId = setTimeout(() => {
				saveUserProfile();
			}, 1000); // 1 second debounce

			return () => clearTimeout(timeoutId);
		}
	}, [
		fullName,
		role,
		institution,
		graduatingYear,
		photo,
		isServerRunning,
		loading,
	]);

	// Update existing posts when photo changes
	useEffect(() => {
		setMyPosts(prevPosts =>
			prevPosts.map(post => ({
				...post,
				author: {
					...post.author,
					name: fullName,
					username,
					avatar: photo,
				},
			}))
		);

		setResourcesPosted(prevResources =>
			prevResources.map(resource => ({
				...resource,
				author: {
					...resource.author,
					name: fullName,
					username,
					avatar: photo,
				},
			}))
		);
	}, [photo, fullName, username]);

	// Cleanup object URLs to prevent memory leaks
	useEffect(() => {
		return () => {
			// Clean up resource URLs (only for old blob URLs, not base64)
			resourcesPosted.forEach(resource => {
				if (
					resource.url &&
					resource.url.startsWith('blob:') &&
					!resource.resourceFile?.data
				) {
					URL.revokeObjectURL(resource.url);
				}
			});

			// Clean up preview URL
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [resourcesPosted, previewUrl]);

	return (
		<div className="page-content">
			<div className="profile-container">
				<div className="profile-header">
					<div className="photo-wrapper">
						<div className="photo-upload">
							{photo ? (
								<img
									src={photo}
									alt="Profile"
									className="profile-photo"
								/>
							) : (
								<div className="photo-placeholder">
									Upload Photo
								</div>
							)}
							<input
								type="file"
								accept="image/*"
								onChange={handlePhotoChange}
							/>
						</div>
					</div>
					<div className="user-info">
						<div className="basic-info">
							{editing ? (
								<>
									<input
										type="text"
										value={fullName}
										onChange={e =>
											setFullName(e.target.value)
										}
										onBlur={saveUserProfile} // Save when field loses focus
										onKeyDown={e => {
											if (e.key === 'Enter') {
												setFullName(e.target.value);
												autoTab();
											}
										}}
										className="edit-input"
									/>
									<input
										type="text"
										value={username}
										ref={usernameRef}
										onChange={e =>
											setUsername(e.target.value)
										}
										onBlur={saveUserProfile} // Save when field loses focus
										onKeyDown={e => {
											if (e.key === 'Enter') {
												setUsername(e.target.value);
												autoTab();
											}
										}}
										className="edit-input username-input"
									/>
									<select
										value={role}
										ref={roleRef}
										onChange={e => setRole(e.target.value)}
										onBlur={saveUserProfile} // Save when field loses focus
										className="edit-input"
										onKeyDown={e => {
											if (e.key === 'Enter') {
												setUsername(e.target.value);
												handleEditToggle();
											}
										}}
									>
										<option value="Student">Student</option>
										<option value="Working Professional">
											Working Professional
										</option>
									</select>
								</>
							) : (
								<>
									<h2>{fullName}</h2>
									<p className="username">@{username}</p>
									<p className="role">{role}</p>
								</>
							)}
							<div className="followers-section">
								<button
									onClick={() =>
										setShowFollowers(!showFollowers)
									}
								>
									{showFollowers
										? 'Hide Followers'
										: `Followers (${followers.length})`}
								</button>
							</div>
						</div>
						<button className="edit-btn" onClick={handleEditToggle}>
							{editing ? <TiTickOutline /> : <FaEdit />}
						</button>
					</div>
				</div>
				{showFollowers && (
					<ul className="followers-list">
						{followers.map(f => (
							<li key={f}>{f}</li>
						))}
					</ul>
				)}

				{/* Error and Loading States */}
				{error && (
					<div
						className="error-message"
						style={{
							background: 'rgba(220, 53, 69, 0.1)',
							border: '1px solid rgba(220, 53, 69, 0.3)',
							color: '#dc3545',
							padding: '1rem',
							borderRadius: '8px',
							margin: '1rem 0',
							backdropFilter: 'blur(10px)',
						}}
					>
						<strong>Error:</strong> {error}
						{!isServerRunning && (
							<div
								style={{
									marginTop: '0.5rem',
									fontSize: '0.9em',
								}}
							>
								💡 Run <code>npm run json-server</code> in a
								separate terminal to start the JSON server.
							</div>
						)}
						<button
							onClick={loadData}
							style={{
								marginTop: '0.5rem',
								padding: '0.5rem 1rem',
								background: 'rgba(220, 53, 69, 0.2)',
								border: '1px solid rgba(220, 53, 69, 0.3)',
								color: '#dc3545',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							Retry
						</button>
					</div>
				)}

				{loading && (
					<div
						className="loading-message"
						style={{
							textAlign: 'center',
							padding: '2rem',
							color: 'rgba(255, 255, 255, 0.7)',
						}}
					>
						Loading data...
					</div>
				)}
				{!showFollowers && (
					<div className="body-container">
						<div className="college">
							<p>
								{role === 'Student'
									? 'College : '
									: 'Company : '}
							</p>
							<input
								type="text"
								placeholder={
									role === 'Student'
										? 'College Name'
										: 'Company Name'
								}
								value={institution}
								onChange={e => setInstitution(e.target.value)}
								onBlur={saveUserProfile} // Save when field loses focus
								className="institution-input"
							/>
						</div>
						{role === 'Student' && (
							<div className="graduation-year">
								<p>Graduation Year : </p>
								<Select
									options={years}
									value={years.find(
										option =>
											option.value === graduatingYear
									)}
									onChange={option => {
										setGraduatingYear(option.value);
										saveUserProfile(); // Save immediately when graduation year changes
									}}
									className="graduation-year-input"
									placeholder="Select Graduation Year"
									styles={{
										control: base => ({
											...base,
											background:
												'rgba(255,255,255,0.05)',
											border: 'none',
											color: 'white',
											backdropFilter: 'blur(10px)',
										}),
										menu: base => ({
											...base,
											background: 'rgba(0, 0, 0, 0.6)',
											backdropFilter: 'blur(20px)',
											color: 'white',
										}),
										menuList: base => ({
											...base,
											maxHeight: '150px',
											overflowY: 'auto',
										}),
										option: (base, state) => ({
											...base,
											backgroundColor: state.isFocused
												? '#4b5563'
												: 'transparent',
											color: 'white',
										}),
										singleValue: base => ({
											...base,
											color: 'white',
										}),
									}}
								/>
							</div>
						)}

						<div className="skills-section">
							<div className="skills-header">
								<h3>Skills</h3>
							</div>

							{editingSkills ? (
								<>
									<div className="skills-wrapper">
										<div className="skills-input">
											<input
												className="skill-input"
												type="text"
												placeholder="Add a skill"
												value={skillInput}
												onChange={e =>
													setSkillInput(
														e.target.value
													)
												}
												onKeyDown={e =>
													e.key === 'Enter' &&
													addSkill()
												}
											/>
											<button
												className="edit-skill-btn"
												onClick={() => {
													addSkill();
													setEditingSkills(
														!editingSkills
													);
												}}
											>
												{editingSkills
													? 'Save'
													: 'Edit'}
											</button>
										</div>
										<div className="skills-list">
											{skills.map(skill => (
												<span
													key={skill}
													className="skill-pill"
												>
													{skill}{' '}
													<button
														onClick={() =>
															removeSkill(skill)
														}
													>
														×
													</button>
												</span>
											))}
										</div>
									</div>
								</>
							) : (
								<div className="skills-list view-only">
									{skills.length > 0 ? (
										skills.map(skill => (
											<span
												key={skill}
												className="skill-pill"
											>
												{skill}
											</span>
										))
									) : (
										<p className="no-skills">
											No skills added yet.
										</p>
									)}
									<button
										className="edit-skill-btn"
										onClick={() => {
											setEditingSkills(!editingSkills);
										}}
									>
										{editingSkills ? 'Save' : 'Edit'}
									</button>
								</div>
							)}
						</div>
						{/* Section Toggle Header */}
						<div className="profile-header-wrapper">
							<div className="profile-sections-header">
								<button
									className={`section-btn ${activeSection === 'posts' ? 'active' : ''}`}
									onClick={() => setActiveSection('posts')}
								>
									My Posts
								</button>
								<button
									className={`section-btn ${activeSection === 'resources' ? 'active' : ''}`}
									onClick={() =>
										setActiveSection('resources')
									}
								>
									Resources You Posted
								</button>
							</div>

							{/* Create Entry Input */}
							{/* Create Entry Input */}
							<div className="create-entry">
								{activeSection === 'posts' ? (
									<>
										<textarea
											rows={3}
											placeholder="What's on your mind? (URLs and emails will be automatically converted to clickable links)"
											value={newPostContent}
											onChange={e =>
												setNewPostContent(
													e.target.value
												)
											}
											className="post-textarea"
											onKeyDown={e => {
												if (
													e.key === 'Enter' &&
													!e.shiftKey &&
													newPostContent.trim()
												) {
													e.preventDefault();
													handleSharePost();
												}
											}}
											required
										/>
										<input
											type="text"
											placeholder="Link title (optional)"
											value={newPostLinkTitle}
											onChange={e =>
												setNewPostLinkTitle(
													e.target.value
												)
											}
											className="resource-url-input"
										/>
										<input
											type="text"
											placeholder="Link URL (optional)"
											value={newPostLinkURL}
											onChange={e =>
												setNewPostLinkURL(
													e.target.value
												)
											}
											className="resource-url-input"
										/>
										<button
											onClick={handleSharePost}
											disabled={!newPostContent.trim()}
										>
											Share Post
										</button>
									</>
								) : (
									<>
										<input
											type="text"
											placeholder="Resource Title"
											value={resourceTitle}
											onChange={e =>
												setResourceTitle(e.target.value)
											}
											className="resource-title-input"
											required
										/>

										<textarea
											rows={3}
											placeholder="Describe how this helped you (required) - URLs and emails will be automatically converted to clickable links"
											value={resourceDescription}
											onChange={e =>
												setResourceDescription(
													e.target.value
												)
											}
											className="resource-description-input"
											required
										/>

										<input
											type="text"
											placeholder="Resource URL (e.g. https://...) - Optional if uploading file"
											value={resourceLink}
											onChange={e =>
												setResourceLink(e.target.value)
											}
											className="resource-url-input"
										/>

										{/* Preview image if URL is provided and looks like an image */}
										{resourceLink &&
											resourceLink.match(
												/\.(jpeg|jpg|png|gif|webp)$/i
											) && (
												<div className="url-image-preview">
													<p className="preview-label">
														URL Image Preview:
													</p>
													<div className="image-preview-upload">
														<img
															src={resourceLink}
															alt="URL Preview"
															className="upload-preview-image"
															onError={e => {
																e.target.style.display =
																	'none';
																e.target.nextSibling.style.display =
																	'block';
															}}
														/>
														<div
															className="image-error"
															style={{
																display: 'none',
															}}
														>
															Invalid image URL or
															failed to load
														</div>
													</div>
												</div>
											)}

										<div className="file-upload-section">
											<label
												htmlFor="pdf-upload"
												className="pdf-upload-icon"
											>
												📎 Upload File (PDF, Images)
											</label>
											<input
												id="pdf-upload"
												type="file"
												accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.mp4,.avi,.mov,.wmv"
												style={{ display: 'none' }}
												onChange={e => {
													const file =
														e.target.files[0];

													// Clean up previous preview URL
													if (previewUrl) {
														URL.revokeObjectURL(
															previewUrl
														);
													}

													setResourceFile(file);

													// Create new preview URL for images
													if (
														file &&
														file.type.startsWith(
															'image/'
														)
													) {
														const newPreviewUrl =
															URL.createObjectURL(
																file
															);
														setPreviewUrl(
															newPreviewUrl
														);
													} else {
														setPreviewUrl(null);
													}
												}}
											/>
											{resourceFile && (
												<div className="file-preview-section">
													<span className="selected-file">
														📄 {resourceFile.name} (
														{(
															resourceFile.size /
															1024 /
															1024
														).toFixed(2)}{' '}
														MB)
													</span>
													{/* Preview image if it's an image file */}
													{resourceFile &&
														resourceFile.type.startsWith(
															'image/'
														) &&
														previewUrl && (
															<div className="image-preview-upload">
																<img
																	src={
																		previewUrl
																	}
																	alt="Preview"
																	className="upload-preview-image"
																/>
															</div>
														)}
												</div>
											)}
										</div>

										<button
											onClick={handleShareResource}
											disabled={
												!resourceTitle.trim() ||
												!resourceDescription.trim() ||
												(!resourceLink.trim() &&
													!resourceFile) ||
												isProcessingFile
											}
										>
											{isProcessingFile
												? 'Processing File...'
												: 'Share Resource'}
										</button>
									</>
								)}
							</div>
						</div>

						{/* My Posts Section */}
						{activeSection === 'posts' && (
							<div className="my-posts-section">
								<h2 className="my-posts-title">My Posts</h2>
								{myPosts.length > 0 ? (
									myPosts.map(post => (
										<div
											key={post.id}
											className="post-card"
										>
											<div className="post-header">
												<div className="avatar-wrapper">
													<img
														src={post.author.avatar}
														alt="avatar"
														className="avatar"
													/>
												</div>
												<div className="author-info">
													<strong>
														{post.author.name}
													</strong>
												</div>
												<div
													className="post-delete"
													onClick={() => {
														setMyPosts(
															myPosts.filter(
																p =>
																	p.id !==
																	post.id
															)
														);
														if (isServerRunning) {
															postsAPI
																.delete(post.id)
																.catch(err =>
																	console.error(
																		'Failed to delete post:',
																		err
																	)
																);
														}
													}}
												>
													<MdDeleteOutline />
												</div>
											</div>

											<p className="post-content">
												{renderTextWithLinks(
													post.content
												)}
											</p>

											{post.link && (
												<a
													href={post.link.url}
													target="_blank"
													rel="noopener noreferrer"
													className="post-link"
												>
													🔗 {post.link.title}
												</a>
											)}

											<div className="post-actions">
												<div className="post-interactions">
													<button>❤️ Like</button>
													<button>💬 Comment</button>
												</div>
												<span className="timestamp">
													{new Date(
														post.timestamp
													).toLocaleString()}
												</span>
											</div>
										</div>
									))
								) : (
									<p className="empty-state">
										You haven’t posted anything yet.
									</p>
								)}
							</div>
						)}

						{/* Resources You Posted Section */}
						{activeSection === 'resources' && (
							<div className="my-posts-section">
								<h2 className="my-posts-title">
									Resources You Posted
								</h2>
								{resourcesPosted.length > 0 ? (
									resourcesPosted.map(r => (
										<div key={r.id} className="post-card">
											<div className="post-header">
												<div className="avatar-wrapper">
													<img
														src={r.author.avatar}
														alt="avatar"
														className="avatar"
													/>
												</div>
												<div className="author-info">
													<strong>
														{r.author.name}
													</strong>
												</div>
												<div
													className="post-delete"
													onClick={() => {
														setResourcesPosted(
															resourcesPosted.filter(
																res =>
																	res.id !==
																	r.id
															)
														);
														if (isServerRunning) {
															resourcesAPI
																.delete(r.id)
																.catch(err =>
																	console.error(
																		'Failed to delete resource:',
																		err
																	)
																);
														}
													}}
												>
													<MdDeleteOutline />
												</div>
											</div>

											<h4 className="resource-title">
												{r.title} <em>({r.type})</em>
											</h4>

											{r.description && (
												<p className="post-content">
													{renderTextWithLinks(
														r.description
													)}
												</p>
											)}

											{/* Show image preview for image types */}
											{r.type === 'Image' && (
												<div className="image-preview">
													<img
														src={
															r.resourceFile &&
															r.resourceFile.data
																? r.resourceFile
																		.data
																: r.url
														}
														alt={r.title}
														className="resource-image clickable-image"
														onClick={() =>
															window.open(
																r.resourceFile &&
																	r
																		.resourceFile
																		.data
																	? r
																			.resourceFile
																			.data
																	: r.url,
																'_blank'
															)
														}
														onError={e => {
															e.target.style.display =
																'none';
															e.target.nextSibling.style.display =
																'block';
														}}
														title="Click to view full size"
													/>
													<div
														className="image-error"
														style={{
															display: 'none',
														}}
													>
														Failed to load image
													</div>
												</div>
											)}

											{/* Show appropriate link based on whether it's a file or URL */}
											{r.resourceFile &&
											r.resourceFile.data ? (
												<a
													href={r.resourceFile.data}
													download={
														r.resourceFile.name
													}
													className="post-link"
												>
													📄 Download {r.type}:{' '}
													{r.resourceFile.name}
												</a>
											) : r.resourceFile ? (
												<a
													href={r.url}
													download={
														r.resourceFile.name
													}
													className="post-link"
												>
													📄 Download {r.type}:{' '}
													{r.resourceFile.name}
												</a>
											) : r.url && r.type !== 'Image' ? (
												<a
													href={r.url}
													target="_blank"
													rel="noopener noreferrer"
													className="post-link"
												>
													🔗 View {r.type}
												</a>
											) : r.url && r.type === 'Image' ? (
												<a
													href={r.url}
													target="_blank"
													rel="noopener noreferrer"
													className="post-link"
												>
													🔗 Open image in new tab
												</a>
											) : null}

											<div className="post-actions">
												<div className="post-interactions">
													<button>👍 Like</button>
													<button>💬 Comment</button>
												</div>
												<span className="timestamp">
													{new Date(
														r.timestamp
													).toLocaleString()}
												</span>
											</div>
										</div>
									))
								) : (
									<p className="empty-state">
										You haven’t shared any resources yet.
									</p>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
export default Profile;
