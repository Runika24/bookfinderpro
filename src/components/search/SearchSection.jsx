// src/components/search/SearchSection.js - Search Interface
import React, { useState, useEffect, useRef } from 'react';
import { useBooks } from '../../hooks/useBooks';
import { getSearchSuggestions } from '../../services/bookService';
import './SearchSection.css';

const SearchSection = () => {
  const {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    searchBooks,
    loading,
    filters,
    updateFilters
  } = useBooks();

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Popular search terms
  const popularTerms = [
    'Python Programming',
    'JavaScript Fundamentals', 
    'React Development',
    'Machine Learning',
    'Data Structures',
    'Web Development'
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookfinder-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Handle input change with suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 1) {
      const newSuggestions = getSearchSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle search execution
  const handleSearch = (term = searchTerm) => {
    if (!term.trim()) return;

    // Add to recent searches
    const newRecentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('bookfinder-recent-searches', JSON.stringify(newRecentSearches));

    // Execute search
    searchBooks(term, searchType);
    setShowSuggestions(false);
    
    // Focus management
    searchInputRef.current?.blur();
  };

  // Handle key press events
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  // Handle popular term selection
  const selectPopularTerm = (term) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    updateFilters({ [filterKey]: value });
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="search-section">
      <div className="search-container">
        {/* Main search bar */}
        <div className="search-bar-container">
          <div className="search-input-wrapper" ref={suggestionsRef}>
            <div className="search-input-group">
              <div className="search-icon">🔍</div>
              
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder={`Search ${searchType === 'title' ? 'book titles' : searchType === 'author' ? 'authors' : searchType === 'subject' ? 'subjects' : 'ISBN numbers'}...`}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
              />

              <select
                className="search-type-select"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="subject">Subject</option>
                <option value="isbn">ISBN</option>
              </select>
            </div>

            {/* Search suggestions dropdown */}
            {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
              <div className="suggestions-dropdown">
                {suggestions.length > 0 && (
                  <div className="suggestions-section">
                    <div className="suggestions-header">💡 Suggestions</div>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        <span className="suggestion-icon">🔍</span>
                        <span className="suggestion-text">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}

                {recentSearches.length > 0 && (
                  <div className="suggestions-section">
                    <div className="suggestions-header">🕒 Recent</div>
                    {recentSearches.slice(0, 3).map((search, index) => (
                      <div
                        key={index}
                        className="suggestion-item recent-search"
                        onClick={() => selectSuggestion(search)}
                      >
                        <span className="suggestion-icon">⏱️</span>
                        <span className="suggestion-text">{search}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="search-actions">
            <button
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
              title="Advanced filters"
            >
              <span className="filter-icon">⚙️</span>
              Filters
            </button>

            <button
              className="search-button"
              onClick={() => handleSearch()}
              disabled={loading || !searchTerm.trim()}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Searching...
                </>
              ) : (
                <>
                  <span className="search-btn-icon">🚀</span>
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Popular searches */}
        <div className="popular-searches">
          <span className="popular-label">🔥 Popular:</span>
          <div className="popular-terms">
            {popularTerms.map((term, index) => (
              <button
                key={index}
                className="popular-term"
                onClick={() => selectPopularTerm(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-header">
              <h3>🎯 Advanced Filters</h3>
              <button
                className="filters-close"
                onClick={() => setShowFilters(false)}
              >
                ✕
              </button>
            </div>

            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">📅 Publication Year</label>
                <div className="year-filters">
                  <input
                    type="number"
                    placeholder="From"
                    className="filter-input"
                    value={filters.yearFrom}
                    onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                  />
                  <span className="year-separator">to</span>
                  <input
                    type="number"
                    placeholder="To"
                    className="filter-input"
                    value={filters.yearTo}
                    onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">🌍 Language</label>
                <select
                  className="filter-select"
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                >
                  <option value="">Any Language</option>
                  <option value="eng">English</option>
                  <option value="spa">Spanish</option>
                  <option value="fre">French</option>
                  <option value="ger">German</option>
                  <option value="ita">Italian</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">⭐ Minimum Rating</label>
                <select
                  className="filter-select"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                >
                  <option value={0}>Any Rating</option>
                  <option value={3.0}>3.0+ Stars</option>
                  <option value={3.5}>3.5+ Stars</option>
                  <option value={4.0}>4.0+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.hasImage}
                    onChange={(e) => handleFilterChange('hasImage', e.target.checked)}
                  />
                  <span className="checkbox-label">📸 Has cover image</span>
                </label>
              </div>
            </div>

            <div className="filters-actions">
              <button
                className="clear-filters"
                onClick={() => updateFilters({
                  language: '',
                  yearFrom: '',
                  yearTo: '',
                  hasImage: false,
                  minRating: 0
                })}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Search tips */}
        <div className="search-tips">
          <div className="tip-item">
            💡 <strong>Pro tip:</strong> Use specific terms like "React.js" or "Machine Learning" for better results
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;