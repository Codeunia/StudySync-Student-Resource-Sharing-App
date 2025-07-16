import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import '../styles/searchFilter.css';

const SearchAndFilter = ({ 
    searchTerm, 
    setSearchTerm, 
    sortBy, 
    setSortBy, 
    placeholder = "Search..." 
}) => {
    return (
        <div className="search-filter-container">
            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            
            <div className="filter-dropdown">
                <FaFilter className="filter-icon" />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                </select>
            </div>
        </div>
    );
};

export default SearchAndFilter;