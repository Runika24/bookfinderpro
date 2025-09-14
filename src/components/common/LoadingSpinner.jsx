// src/components/common/LoadingSpinner.js - Loading States
import React, { useState, useEffect } from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  message = "Searching for amazing books...", 
  type = "search",
  size = "large" 
}) => {
  const [loadingMessage, setLoadingMessage] = useState(message);
  const [dots, setDots] = useState('');

  // Rotating loading messages
  const loadingMessages = [
    "🔍 Searching through millions of books...",
    "📚 Finding the perfect matches for you...",
    "⭐ Discovering highly-rated books...",
    "🎯 Filtering by your preferences...",
    "📖 Almost there, preparing your results..."
  ];

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Rotate loading message every 3 seconds
  useEffect(() => {
    if (type === 'search') {
      let messageIndex = 0;
      const interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [type]);

  const renderSpinner = () => {
    switch (type) {
      case 'search':
        return (
          <div className="search-spinner">
            <div className="book-stack">
              <div className="book book1">📕</div>
              <div className="book book2">📘</div>
              <div className="book book3">📗</div>
              <div className="book book4">📙</div>
            </div>
            <div className="search-beam"></div>
          </div>
        );
      
      case 'dots':
        return (
          <div className="dots-spinner">
            <div className="dot dot1"></div>
            <div className="dot dot2"></div>
            <div className="dot dot3"></div>
          </div>
        );
      
      case 'books':
        return (
          <div className="books-spinner">
            <div className="flying-book">📖</div>
            <div className="flying-book">📚</div>
            <div className="flying-book">📕</div>
          </div>
        );
      
      case 'simple':
        return (
          <div className="simple-spinner">
            <div className="spinner-ring"></div>
          </div>
        );
      
      default:
        return (
          <div className="default-spinner">
            <div className="spinner-circle">
              <div className="spinner-arc"></div>
            </div>
          </div>
        );
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <div className="progress-steps">
          <span className="step completed">🔍 Searching</span>
          <span className="step active">📊 Processing</span>
          <span className="step">📚 Loading</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`loading-container ${size}`}>
      {/* Main Loading Animation */}
      <div className="loading-animation">
        {renderSpinner()}
      </div>

      {/* Loading Message */}
      <div className="loading-message">
        <h3 className="loading-title">
          {loadingMessage}
          <span className="loading-dots">{dots}</span>
        </h3>
        
        {type === 'search' && (
          <p className="loading-subtitle">
            This might take a few seconds while we search through our extensive library
          </p>
        )}
      </div>

      {/* Progress Bar for Search */}
      {type === 'search' && renderProgressBar()}

      {/* Loading Stats */}
      {type === 'search' && (
        <div className="loading-stats">
          <div className="stat-item">
            <span className="stat-icon">📚</span>
            <span className="stat-text">Scanning millions of books</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔍</span>
            <span className="stat-text">Applying smart filters</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-text">Finding top-rated matches</span>
          </div>
        </div>
      )}

      {/* Loading Tips */}
      {type === 'search' && (
        <div className="loading-tips">
          <h4>💡 Did you know?</h4>
          <div className="tip-carousel">
            <p>Our search covers over 20 million books from Open Library</p>
          </div>
        </div>
      )}

      {/* Skeleton Loader Preview */}
      {type === 'search' && (
        <div className="skeleton-preview">
          <h4>🔮 Preparing your results...</h4>
          <div className="skeleton-books">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-book">
                <div className="skeleton-cover"></div>
                <div className="skeleton-info">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-author"></div>
                  <div className="skeleton-rating"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Button for Long Searches */}
      {type === 'search' && (
        <div className="loading-actions">
          <button className="cancel-search-btn">
            ❌ Cancel Search
          </button>
          <p className="loading-help">
            Taking too long? Try using more specific search terms
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;