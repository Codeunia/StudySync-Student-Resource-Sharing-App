// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { postsAPI, resourcesAPI, uploadAPI } from '../utils/api';
import { FaHeart, FaRegHeart, FaRegComment, FaTrash } from 'react-icons/fa';

const Profile = ({ user }) => {
    if (!user) {
        return <div className="loading-message">Loading user profile...</div>;
    }

    const [myPosts, setMyPosts] = useState([]);
    const [myResources, setMyResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('posts');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                const [userPosts, userResources] = await Promise.all([
                    postsAPI.getMyPosts(),
                    resourcesAPI.getMyResources()
                ]);
                setMyPosts(userPosts);
                setMyResources(userResources);
            } catch (err) {
                setError(`Failed to load your data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, [user._id]);

    const handleSharePost = async (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if (!content.trim()) return;
        try {
            const newPost = await postsAPI.create({ content });
            setMyPosts([newPost, ...myPosts]);
            e.target.reset();
        } catch (err) {
            setError(`Failed to create post: ${err.message}`);
        }
    };

    const handleShareResource = async (e) => {
        e.preventDefault();
        const { title, description } = e.target.elements;
        const file = e.target.elements.file.files[0];
        if (!title.value || !description.value || !file) {
            return setError('Title, description, and a file are required.');
        }
        setIsProcessing(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const uploadResponse = await uploadAPI.uploadFile(formData);
            const newResource = await resourcesAPI.create({
                title: title.value,
                description: description.value,
                url: uploadResponse.url,
                cloudinaryId: uploadResponse.cloudinaryId,
            });
            setMyResources([newResource, ...myResources]);
            e.target.reset();
        } catch (err) {
            setError(`Failed to create resource: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await postsAPI.delete(postId);
                setMyPosts(currentPosts => currentPosts.filter(post => post._id !== postId));
            } catch (err) {
                setError(`Failed to delete post: ${err.message}`);
            }
        }
    };

    const handleDeleteResource = async (resourceId) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await resourcesAPI.delete(resourceId);
                setMyResources(currentResources => currentResources.filter(resource => resource._id !== resourceId));
            } catch (err) {
                setError(`Failed to delete resource: ${err.message}`);
            }
        }
    };

    const handleLikePost = async (postId) => {
        setMyPosts(currentPosts => currentPosts.map(post => {
            if (post._id === postId) {
                const isLiked = post.likes.includes(user._id);
                const newLikes = isLiked
                    ? post.likes.filter(id => id !== user._id)
                    : [...post.likes, user._id];
                return { ...post, likes: newLikes };
            }
            return post;
        }));
        try { await postsAPI.like(postId); } 
        catch (err) { setError(`Failed to update like: ${err.message}`); }
    };

    const handleAddComment = async (e, postId) => {
        e.preventDefault();
        const commentText = e.target.elements.comment.value;
        if (!commentText.trim()) return;
        try {
            const updatedPost = await postsAPI.addComment(postId, { text: commentText });
            setMyPosts(myPosts.map(p => (p._id === postId ? updatedPost : p)));
            e.target.reset();
        } catch (err) {
            setError(`Failed to add comment: ${err.message}`);
        }
    };

    if (loading) {
        return <div className="loading-message">Loading your content...</div>;
    }

    return (
        <div className="page-content">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="photo-wrapper"><img src={user.image} alt="Profile" className="profile-photo" /></div>
                    <div className="user-info"><h2>{user.displayName}</h2></div>
                </div>

                {error && <div className="error-message" style={{ color: 'red', margin: '1rem 0', textAlign: 'center' }}>{error}</div>}

                <div className="profile-header-wrapper">
                    <div className="profile-sections-header">
                        <button className={`section-btn ${activeSection === 'posts' ? 'active' : ''}`} onClick={() => setActiveSection('posts')}>My Posts</button>
                        <button className={`section-btn ${activeSection === 'resources' ? 'active' : ''}`} onClick={() => setActiveSection('resources')}>My Resources</button>
                    </div>

                    <div className="create-entry">
                        {activeSection === 'posts' ? (
                            <form onSubmit={handleSharePost}>
                                <textarea name="content" rows="3" placeholder="Share something new..." required />
                                <button type="submit">Share Post</button>
                            </form>
                        ) : (
                            <form onSubmit={handleShareResource}>
                                <input name="title" type="text" placeholder="Resource Title" required />
                                <textarea name="description" rows="3" placeholder="Describe the resource..." required />
                                <div className="file-upload-section">
                                    <label htmlFor="resource-file-upload">Upload File (Image, PDF, etc.):</label>
                                    <input name="file" id="resource-file-upload" type="file" required />
                                </div>
                                <button type="submit" disabled={isProcessing}>{isProcessing ? 'Uploading...' : 'Share Resource'}</button>
                            </form>
                        )}
                    </div>
                </div>

                {activeSection === 'posts' ? (
                    <div className="my-posts-section">
                        <h2>My Posts ({myPosts.length})</h2>
                        {myPosts.map(post => (
                            <div key={post._id} className="post-card">
                                <div className="post-header">
                                    <img src={post.author?.image} alt={post.author?.displayName} className="avatar" />
                                    <div className="author-info">
                                        <strong>{post.author?.displayName}</strong>
                                        <span className="timestamp">{new Date(post.timestamp).toLocaleString()}</span>
                                    </div>
                                    <button onClick={() => handleDeletePost(post._id)} className="delete-btn"><FaTrash /></button>
                                </div>
                                <p className="post-content">{post.content}</p>
                                <div className="post-actions">
                                    <button onClick={() => handleLikePost(post._id)} className="action-btn">
                                        {post.likes.includes(user._id) ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />}
                                        <span>{post.likes.length}</span>
                                    </button>
                                    <button className="action-btn">
                                        <FaRegComment /><span>{post.comments.length}</span>
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
                ) : (
                    <div className="my-posts-section">
                        <h2>My Resources ({myResources.length})</h2>
                        {myResources.map(resource => (
                            <div key={resource._id} className="post-card">
                                <div className="post-header">
                                    <img src={resource.author?.image} alt={resource.author?.displayName} className="avatar" />
                                    <div className="author-info">
                                        <strong>{resource.author?.displayName}</strong>
                                        <span className="timestamp">{new Date(resource.timestamp).toLocaleString()}</span>
                                    </div>
                                    <button onClick={() => handleDeleteResource(resource._id)} className="delete-btn"><FaTrash /></button>
                                </div>
                                <h4 className="resource-title">{resource.title}</h4>
                                <p className="post-content">{resource.description}</p>
                                <div className="resource-content">
                                    {resource.url && resource.url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                            <img src={resource.url.replace('/upload/', '/upload/w_400,q_auto,f_auto/')} alt={resource.title} className="resource-image-preview" />
                                        </a>
                                    ) : (
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="post-link">🔗 View or Download Resource</a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Profile;