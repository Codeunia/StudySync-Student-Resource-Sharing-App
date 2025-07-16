import React, { useState, useEffect, useMemo  } from 'react';
import '../styles/pages.css';
import '../styles/profile.css';
import SearchAndFilter from '../components/SearchAndFilter';
import {
	resourcesAPI,
	usersAPI,
	enrichWithUserData,
	checkServerStatus,
} from '../utils/api';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isServerRunning, setIsServerRunning] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Filter and sort resources based on search and sort criteria
    const filteredAndSortedResources = useMemo(() => {
        let filtered = resources.filter(resource => {
            const searchLower = searchTerm.toLowerCase();
            return (
                resource.title.toLowerCase().includes(searchLower) ||
                resource.description.toLowerCase().includes(searchLower) ||
                resource.author.name.toLowerCase().includes(searchLower) ||
                resource.author.username.toLowerCase().includes(searchLower) ||
                resource.type.toLowerCase().includes(searchLower)
            );
        });

        // Sort based on selected criteria
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.timestamp) - new Date(b.timestamp);
                case 'popular':
                    return (b.likes || 0) - (a.likes || 0);
                case 'newest':
                default:
                    return new Date(b.timestamp) - new Date(a.timestamp);
            }
        });
    }, [resources, searchTerm, sortBy]);

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

    // Load all resources from API
    const loadResources = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if server is running
            const serverStatus = await checkServerStatus();
            setIsServerRunning(serverStatus);

            if (!serverStatus) {
                // Provide fallback data when server is not running
                console.warn('JSON Server not running, using fallback data');
                setResources([
                    {
                        id: 1,
                        authorUsername: 'venkatjaswanth',
                        author: {
                            name: 'Venkat Jaswanth',
                            username: 'venkatjaswanth',
                            avatar: "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='%23007bff'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-family='Arial' font-size='16' font-weight='bold'%3EVJ%3C/text%3E%3C/svg%3E",
                        },
                        title: 'DSA Notes PDF',
                        type: 'PDF',
                        resourceFile: null,
                        url: '/notes/dsa.pdf',
                        description:
                            'These notes helped me master linked lists and trees for my exam!',
                        timestamp: '2025-07-10T12:00:00Z',
                        likes: 25,
                    },
                    {
                        id: 2,
                        authorUsername: 'venkatjaswanth',
                        author: {
                            name: 'Venkat Jaswanth',
                            username: 'venkatjaswanth',
                            avatar: "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='%23007bff'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-family='Arial' font-size='16' font-weight='bold'%3EVJ%3C/text%3E%3C/svg%3E",
                        },
                        title: 'React Tutorial Video',
                        type: 'Video',
                        resourceFile: null,
                        url: 'https://youtu.be/react-tutorial',
                        description:
                            'This walkthrough clarified hooks for me—highly recommend!',
                        timestamp: '2025-07-08T09:30:00Z',
                        likes: 18,
                    },
                ]);

                setError(
                    'JSON Server is not running. Using demo data. Start the server with "npm run json-server" for data persistence.'
                );
                return;
            }

            // Load resources and users, then enrich resources with user data
            const [allResources, users] = await Promise.all([
                resourcesAPI.getAll(),
                usersAPI.getAll(),
            ]);

            // Enrich resources with user data
            const enrichedResources = await enrichWithUserData(
                allResources,
                users
            );
            setResources(enrichedResources);
        } catch (err) {
            setError(`Failed to load resources: ${err.message}`);
            console.error('Error loading resources:', err);

            // Provide fallback data on error too
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    // Load resources when component mounts
    useEffect(() => {
        loadResources();
    }, []);

    return (
        <div className="page-content">
            <div className="profile-container">
                <h1>Study Resources</h1>
                <p>
                    Discover and share study materials, guides, and helpful
                    resources with the community.
                </p>

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
                            onClick={loadResources}
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
                        Loading resources...
                    </div>
                )}

                {/* Resources Section */}
                {!loading && (
                    <div className="my-posts-section">
                        <h2 className="my-posts-title">Study Resources</h2>
                        
                        <SearchAndFilter
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            placeholder="Search resources by title, description, author, or type..."
                        />

                        {filteredAndSortedResources.length > 0 ? (
                            filteredAndSortedResources.map(resource => (
                                <div key={resource.id} className="post-card">
                                    <div className="post-header">
                                        <div className="avatar-wrapper">
                                            <img
                                                src={
                                                    resource.author.avatar ||
                                                    "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='%23007bff'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-family='Arial' font-size='16' font-weight='bold'%3E%3F%3C/text%3E%3C/svg%3E"
                                                }
                                                alt="avatar"
                                                className="avatar"
                                                onError={e => {
                                                    e.target.src =
                                                        "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='%23007bff'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-family='Arial' font-size='16' font-weight='bold'%3E%3F%3C/text%3E%3C/svg%3E";
                                                }}
                                            />
                                        </div>
                                        <div className="author-info">
                                            <strong>{resource.author.name}</strong>
                                            <p className="username">
                                                @{resource.author.username}
                                            </p>
                                        </div>
                                    </div>

                                    <h4 className="resource-title">
                                        {resource.title} <em>({resource.type})</em>
                                    </h4>

                                    {resource.description && (
                                        <p className="post-content">
                                            {renderTextWithLinks(resource.description)}
                                        </p>
                                    )}

                                    {/* Image Preview for Image type resources */}
                                    {resource.type === 'Image' && (
                                        <div className="image-preview">
                                            <img
                                                src={
                                                    resource.resourceFile &&
                                                    resource.resourceFile.data
                                                        ? resource.resourceFile.data
                                                        : resource.url
                                                }
                                                alt={resource.title}
                                                className="resource-image clickable-image"
                                                onClick={() =>
                                                    window.open(
                                                        resource.resourceFile &&
                                                            resource.resourceFile.data
                                                            ? resource.resourceFile.data
                                                            : resource.url,
                                                        '_blank'
                                                    )
                                                }
                                                onError={e => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'block';
                                                }}
                                                title="Click to view full size"
                                            />
                                            <div
                                                className="image-error"
                                                style={{ display: 'none' }}
                                            >
                                                Failed to load image
                                            </div>
                                        </div>
                                    )}

                                    {/* Download/View Links */}
                                    {resource.resourceFile && resource.resourceFile.data ? (
                                        <a
                                            href={resource.resourceFile.data}
                                            download={resource.resourceFile.name}
                                            className="post-link"
                                        >
                                            📄 Download {resource.type}: {resource.resourceFile.name}
                                        </a>
                                    ) : resource.resourceFile ? (
                                        <a
                                            href={resource.url}
                                            download={resource.resourceFile.name}
                                            className="post-link"
                                        >
                                            📄 Download {resource.type}: {resource.resourceFile.name}
                                        </a>
                                    ) : resource.url && resource.type !== 'Image' ? (
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="post-link"
                                        >
                                            🔗 View {resource.type}
                                        </a>
                                    ) : resource.url && resource.type === 'Image' ? (
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="post-link"
                                        >
                                            🔗 Open image in new tab
                                        </a>
                                    ) : null}

                                    <div className="post-actions">
                                        <div className="post-interactions">
                                            <button>👍 Like ({resource.likes || 0})</button>
                                            <button>💬 Comment ({resource.comments || 0})</button>
                                        </div>
                                        <span className="timestamp">
                                            {new Date(resource.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-state">
                                {searchTerm 
                                    ? 'No resources found matching your search.' 
                                    : 'No resources available yet.'}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resources;