import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { resourcesAPI } from '../utils/api';
import SearchAndFilter from '../components/SearchAndFilter';

// --- Placeholder Component (Unchanged) ---
const PlaceholderCard = () => (
    <div className="post-card placeholder-card">
        <div className="post-header">
            <div className="placeholder-item placeholder-avatar"></div>
            <div className="author-info" style={{ flexGrow: 1 }}>
                <div className="placeholder-item placeholder-line"></div>
                <div className="placeholder-item placeholder-line short"></div>
            </div>
        </div>
        <div className="placeholder-item placeholder-line" style={{ height: '24px', marginBottom: '1rem' }}></div>
        <div className="placeholder-item placeholder-line"></div>
        <div className="placeholder-item placeholder-line"></div>
        <div className="placeholder-item placeholder-line short"></div>
    </div>
);

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NEW: State for search and filter ---
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const loadResources = useCallback(async (pageNum) => {
        if (pageNum > 1) {
            setLoading(true);
        }
        try {
            const data = await resourcesAPI.getAll(pageNum);
            setResources(prev => (pageNum === 1 ? data.resources : [...prev, ...data.resources]));
            setPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError(`Failed to load resources: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadResources(1);
    }, [loadResources]);

    // --- NEW: Memoized filtering and sorting ---
    const filteredAndSortedResources = useMemo(() => {
        let filtered = resources.filter(resource => {
            const searchLower = searchTerm.toLowerCase();
            // Search in title, description, and author's name
            return (
                resource.title.toLowerCase().includes(searchLower) ||
                resource.description.toLowerCase().includes(searchLower) ||
                (resource.author && resource.author.displayName.toLowerCase().includes(searchLower))
            );
        });

        // Sort the filtered results
        return filtered.sort((a, b) => {
            // Note: 'popular' sort is not implemented for resources as there's no 'likes' field.
            // It will default to sorting by 'newest'.
            if (sortBy === 'oldest') {
                return new Date(a.timestamp) - new Date(b.timestamp);
            }
            return new Date(b.timestamp) - new Date(a.timestamp); // 'newest' and default
        });
    }, [resources, searchTerm, sortBy]);


    const handleLoadMore = () => {
        if (!loading && page < totalPages) {
            loadResources(page + 1);
        }
    };

    if (error) {
        return <div className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</div>;
    }

    // --- NEW: Check if a search/filter is active ---
    const isFiltering = searchTerm.trim() !== '' || sortBy !== 'newest';

    return (
        <div className="page-content">
            <h1>Study Resources</h1>
            <p>Discover and share materials with the community.</p>

            {/* --- UPDATED: Pass props to SearchAndFilter --- */}
            <SearchAndFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                placeholder="Search resources by title, author..."
            />

            <div className="posts-list">
                {loading && page === 1 ? (
                    Array.from({ length: 3 }).map((_, index) => <PlaceholderCard key={index} />)
                ) : (
                    // --- UPDATED: Map over the filtered and sorted list ---
                    filteredAndSortedResources.map(resource => (
                        <div key={resource._id} className="post-card">
                            <div className="post-header">
                                <img src={resource.author?.image} alt={resource.author?.displayName} className="avatar" />
                                <div className="author-info">
                                    <strong>{resource.author?.displayName}</strong>
                                    <span className="timestamp">{new Date(resource.timestamp).toLocaleString()}</span>
                                </div>
                            </div>

                            <h4 className="resource-title">{resource.title}</h4>
                            <div className="post-content">
                                <p>{resource.description}</p>
                                <div className="resource-content">
                                    {resource.url && resource.url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                            <img src={resource.url.replace('/upload/', '/upload/q_auto,f_auto/')} alt={resource.title} className="resource-image-preview" style={{borderRadius: '8px', marginTop: '1rem'}} />
                                        </a>
                                    ) : (
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="post-link">
                                            🔗 View or Download Resource
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {loading && page > 1 && <div className="loading-message" style={{color: 'white', textAlign: 'center'}}>Loading more...</div>}
            
            {/* --- UPDATED: Conditionally show "Load More" button --- */}
            {/* Hide the button if a search or filter is active to avoid confusion */}
            {!loading && page < totalPages && !isFiltering && (
                <div style={{textAlign: 'center', marginTop: '2rem'}}>
                    <button onClick={handleLoadMore} className="login-button">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default Resources;