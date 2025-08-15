// src/pages/Feed.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { postsAPI, isAuthenticated } from '../utils/api';
import SearchAndFilter from '../components/SearchAndFilter';
import { FaHeart, FaRegHeart, FaRegComment, FaTrash } from 'react-icons/fa';

const Feed = ({ user }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [newPostContent, setNewPostContent] = useState('');

    useEffect(() => {
        const loadPosts = async () => {
            // Check authentication before making API call
            if (!isAuthenticated()) {
                console.log('User not authenticated, skipping posts fetch');
                setError('Please log in to view posts');
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                const fetchedPosts = await postsAPI.getAll();
                setPosts(fetchedPosts);
            } catch (err) {
                setError(`Failed to load posts: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    const filteredAndSortedPosts = useMemo(() => {
        let filtered = posts.filter(post => {
            const searchLower = searchTerm.toLowerCase();
            return (
                post.content.toLowerCase().includes(searchLower) ||
                (post.author && post.author.displayName.toLowerCase().includes(searchLower))
            );
        });

        return filtered.sort((a, b) => {
            if (sortBy === 'popular') {
                return (b.likes?.length || 0) - (a.likes?.length || 0);
            }
            if (sortBy === 'oldest') {
                return new Date(a.timestamp) - new Date(b.timestamp);
            }
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
    }, [posts, searchTerm, sortBy]);

    const handleCreatePost = async (e) => {
        e.preventDefault(); // Prevent page reload
        if (!newPostContent.trim()) return; // Extra check
        try {
            const createdPost = await postsAPI.create({ content: newPostContent });
            setPosts([createdPost, ...posts]);
            setNewPostContent(''); // Clear the textarea
        } catch (err) {
            setError(`Failed to create post: ${err.message}`);
        }
    };

    const handleLike = async (postId) => {
        setPosts(currentPosts => currentPosts.map(post => {
            if (post._id === postId) {
                const isLiked = post.likes.includes(user._id);
                const newLikes = isLiked
                    ? post.likes.filter(id => id !== user._id)
                    : [...post.likes, user._id];
                return { ...post, likes: newLikes };
            }
            return post;
        }));
        try {
            await postsAPI.like(postId);
        } catch (err) {
            setError(`Failed to update like: ${err.message}`);
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await postsAPI.delete(postId);
                setPosts(posts.filter(post => post._id !== postId));
            } catch (err) {
                setError(`Failed to delete post: ${err.message}`);
            }
        }
    };

    const handleAddComment = async (e, postId) => {
        e.preventDefault();
        const commentText = e.target.elements.comment.value;
        if (!commentText.trim()) return;
        try {
            const updatedPost = await postsAPI.addComment(postId, { text: commentText });
            setPosts(posts.map(p => (p._id === postId ? updatedPost : p)));
            e.target.reset();
        } catch (err) {
            setError(`Failed to add comment: ${err.message}`);
        }
    };

    if (loading) return <div className="loading-message">Loading posts...</div>;

    return (
        <div className="page-content">
            <h1>Feed</h1>
            <p>See what everyone is talking about.</p>

            {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}

            <div className="create-post-card">
                {/* The form's onSubmit handles the logic */}
                <form onSubmit={handleCreatePost}>
                    <textarea
                        rows="3"
                        placeholder={`What's on your mind, ${user.firstName}?`}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        required
                    />
                    {/* This button just submits the form and is disabled when there's no text */}
                    <button type="submit" disabled={!newPostContent.trim()}>
                        Post
                    </button>
                </form>
            </div>

            <SearchAndFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                placeholder="Search posts..."
            />

            <div className="posts-list">
                {filteredAndSortedPosts.map(post => (
                    <div key={post._id} className="post-card">
                        <div className="post-header">
                            <img src={post.author?.image} alt={post.author?.displayName} className="avatar" />
                            <div className="author-info">
                                <strong>{post.author?.displayName}</strong>
                                <span className="timestamp">{new Date(post.timestamp).toLocaleString()}</span>
                            </div>
                            {user._id === post.author?._id && (
                                <button onClick={() => handleDelete(post._id)} className="delete-btn">
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                        <p className="post-content">{post.content}</p>
                        <div className="post-actions">
                            <button onClick={() => handleLike(post._id)} className="action-btn like-btn">
                                {post.likes.includes(user._id) ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />}
                                <span style={{marginLeft: '8px'}}>{post.likes.length}</span>
                            </button>
                            <button className="action-btn">
                                <FaRegComment />
                                <span style={{marginLeft: '8px'}}>{post.comments.length}</span>
                            </button>
                        </div>
                        <div className="comments-section">
                            {post.comments.map(comment => (
                                <div key={comment._id} className="comment">
                                    <img src={comment.author?.image} alt={comment.author?.displayName} className="avatar-sm" />
                                    <p><strong>{comment.author?.displayName}</strong> {comment.text}</p>
                                </div>
                            ))}
                            <form onSubmit={(e) => handleAddComment(e, post._id)} className="comment-form">
                                <input type="text" name="comment" placeholder="Add a comment..." required />
                                <button type="submit">Post</button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Feed;