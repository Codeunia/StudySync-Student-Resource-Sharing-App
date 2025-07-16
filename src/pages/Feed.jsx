import React, { useState, useEffect, useMemo } from 'react';
// import '../styles/pages.css';
// import '../styles/profile.css';
import SearchAndFilter from '../components/SearchAndFilter';
import {
    postsAPI,
    usersAPI,
    enrichWithUserData,
    checkServerStatus,
} from '../utils/api';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isServerRunning, setIsServerRunning] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const filteredAndSortedPosts = useMemo(() => {
        let filtered = posts.filter(post => {
            const searchLower = searchTerm.toLowerCase();
            return (
                post.content.toLowerCase().includes(searchLower) ||
                post.author.name.toLowerCase().includes(searchLower) ||
                post.author.username.toLowerCase().includes(searchLower) ||
                (post.link &&
                    post.link.title.toLowerCase().includes(searchLower))
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
    }, [posts, searchTerm, sortBy]);

    // Function to detect and render clickable links in text...
    const renderTextWithLinks = text => {
        if (!text) return text;

        // Enhanced regex to detect various URL formats and email addresses....
        const urlRegex =
            /(https?:\/\/(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w/_.])*)?(?:\?(?:[\w&=%.-])*)?(?:#(?:[\w.-])*)?|www\.(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w/_.])*)?(?:\?(?:[\w&=%.-])*)?(?:#(?:[\w.-])*)?|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                let url,
                    displayText = part;

                if (part.includes('@')) {
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

    // Load all posts from API
    const loadPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Check if server is running
            const serverStatus = await checkServerStatus();
            setIsServerRunning(serverStatus);

            if (!serverStatus) {
                // Provide fallback data when server is not running
                console.warn('JSON Server not running, using fallback data');
                setPosts([
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
                        authorUsername: 'venkatjaswanth',
                        author: {
                            name: 'Venkat Jaswanth',
                            username: 'venkatjaswanth',
                            avatar: "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='%23007bff'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-family='Arial' font-size='16' font-weight='bold'%3EVJ%3C/text%3E%3C/svg%3E",
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
                        authorUsername: 'venkatjaswanth',
                        author: {
                            name: 'Venkat Jaswanth',
                            username: 'venkatjaswanth',
                            avatar: "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='%23007bff'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-family='Arial' font-size='16' font-weight='bold'%3EVJ%3C/text%3E%3C/svg%3E",
                        },
                    },
                ]);

                setError(
                    'JSON Server is not running. Using demo data. Start the server with "npm run json-server" for data persistence.'
                );
                return;
            }

            // Load posts and users, then enrich posts with user data
            const [allPosts, users] = await Promise.all([
                postsAPI.getAll(),
                usersAPI.getAll(),
            ]);

            // Enrich posts with user data
            const enrichedPosts = await enrichWithUserData(allPosts, users);
            setPosts(enrichedPosts);
        } catch (err) {
            setError(`Failed to load posts: ${err.message}`);
            console.error('Error loading posts:', err);

            // Provide fallback data on error too
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // Load posts when component mounts
    useEffect(() => {
        loadPosts();
    }, []);

    return (
        <div className="page-content">
            <div className="profile-container">
                <h1>Feed</h1>
                <p>
                    Here you'll see the latest updates from your study groups
                    and shared resources.
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
                            onClick={loadPosts}
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
                        Loading posts...
                    </div>
                )}

                {/* Posts Section */}
                {!loading && (
                    <div className="my-posts-section">
                        <h2 className="my-posts-title">Recent Posts</h2>
                        <SearchAndFilter
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            placeholder="Search posts by content, author, or link..."
                        />
                        {filteredAndSortedPosts.length > 0 ? (
                            filteredAndSortedPosts.map(post => (
                                <div key={post.id} className="post-card">
                                    <div className="post-header">
                                        <div className="avatar-wrapper">
                                            <img
                                                src={
                                                    post.author.avatar ||
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
                                            <strong>{post.author.name}</strong>
                                            {/* <p className="username">
                                                @{post.author.username}
                                            </p> */}
                                        </div>
                                    </div>

                                    <p className="post-content">
                                        {renderTextWithLinks(post.content)}
                                    </p>

                                    {post.link && (
                                        <a
                                            href={post.link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="post-link"
                                        >
                                            🔗{' '}
                                            {post.link.title || post.link.url}
                                        </a>
                                    )}

                                    <div className="post-actions">
                                        <div className="post-interactions">
                                            <button>
                                                ❤️ Like ({post.likes || 0})
                                            </button>
                                            <button>
                                                💬 Comment ({post.comments || 0}
                                                )
                                            </button>
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
                                {searchTerm ? 'No posts found matching your search.' : 'No posts available yet.'}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;