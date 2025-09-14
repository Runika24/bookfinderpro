// src/components/books/BookCard.js - Individual Book Card
import React, { useState } from 'react';
import { useBooks } from '../../hooks/useBooks';
import { getCoverURL } from '../../services/api';
import { formatAuthors, formatSubjects } from '../../utils/formatters';
import './BookCard.css';

const BookCard = ({ book, onDetailsClick }) => {
  const { toggleFavorite, isBookFavorited } = useBooks();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFavorite = isBookFavorited(book);
  const coverUrl = getCoverURL(book.cover_i, 'M');

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(book);
  };

  const handleCardClick = () => {
    if (onDetailsClick) {
      onDetailsClick(book);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Get rating stars
  const renderRatingStars = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    
    return <div className="rating-stars">{stars}</div>;
  };

  // Get status badge
  const getStatusBadge = () => {
    if (book.ratings_average >= 4.5) {
      return <div className="status-badge bestseller">🏆 Bestseller</div>;
    }
    if (book.first_publish_year >= new Date().getFullYear() - 2) {
      return <div className="status-badge new-release">🆕 New Release</div>;
    }
    if (book.availability_status === 'Available') {
      return <div className="status-badge available">✅ Available</div>;
    }
    return null;
  };

  return (
    <article 
      className={`book-card ${isFavorite ? 'favorited' : ''}`}
      onClick={handleCardClick}
    >
      {/* Book cover section */}
      <div className="book-cover-section">
        <div className="book-cover-container">
          {coverUrl && !imageError ? (
            <>
              {!imageLoaded && <div className="cover-skeleton"></div>}
              <img
                src={coverUrl}
                alt={`Cover of ${book.title}`}
                className={`book-cover ${imageLoaded ? 'loaded' : ''}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          ) : (
            <div className="book-cover-placeholder">
              <div className="placeholder-icon">📚</div>
              <div className="placeholder-text">No Cover</div>
            </div>
          )}
          
          {/* Overlay with actions */}
          <div className="book-cover-overlay">
            <button
              className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
              onClick={handleFavoriteClick}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
            
            <button 
              className="view-details-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              title="View details"
            >
              👁️
            </button>
          </div>

          {/* Status badges */}
          <div className="status-badges">
            {getStatusBadge()}
          </div>
        </div>
      </div>

      {/* Book information section */}
      <div className="book-info-section">
        <header className="book-header">
          <h3 className="book-title" title={book.title}>
            {book.title}
          </h3>
          
          <div className="book-authors">
            <span className="author-icon">👤</span>
            <span className="author-names" title={formatAuthors(book.author_name)}>
              {formatAuthors(book.author_name)}
            </span>
          </div>
        </header>

        <div className="book-metadata">
          {/* Publication year */}
          {book.first_publish_year && (
            <div className="metadata-item">
              <span className="metadata-icon">📅</span>
              <span className="metadata-text">{book.first_publish_year}</span>
            </div>
          )}

          {/* Reading time */}
          {book.estimated_read_time && (
            <div className="metadata-item">
              <span className="metadata-icon">⏰</span>
              <span className="metadata-text">{book.estimated_read_time}h read</span>
            </div>
          )}

          {/* Page count */}
          {book.number_of_pages_median && (
            <div className="metadata-item">
              <span className="metadata-icon">📄</span>
              <span className="metadata-text">{book.number_of_pages_median} pages</span>
            </div>
          )}

          {/* Language */}
          {book.language && book.language.length > 0 && (
            <div className="metadata-item">
              <span className="metadata-icon">🌍</span>
              <span className="metadata-text">{book.language[0].toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Rating section */}
        {book.ratings_average && (
          <div className="book-rating">
            {renderRatingStars(book.ratings_average)}
            <div className="rating-info">
              <span className="rating-score">{book.ratings_average.toFixed(1)}</span>
              {book.ratings_count && (
                <span className="rating-count">({book.ratings_count.toLocaleString()})</span>
              )}
            </div>
          </div>
        )}

        {/* Subject tags */}
        {book.subject && book.subject.length > 0 && (
          <div className="book-subjects">
            {formatSubjects(book.subject).map((subject, index) => (
              <span key={index} className="subject-tag">
                {subject}
              </span>
            ))}
          </div>
        )}

        {/* Reading level */}
        {book.reading_level && (
          <div className="reading-level">
            <span className="level-indicator">{book.reading_level}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="book-actions">
          <button 
            className="action-btn primary"
            onClick={(e) => {
              e.stopPropagation();
              // Add to reading list logic here
            }}
          >
            📚 Want to Read
          </button>
          
          <button 
            className="action-btn secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            ℹ️ Details
          </button>
        </div>
      </div>

      {/* Quick stats footer */}
      <footer className="book-footer">
        <div className="book-stats">
          {book.popularity_score > 0 && (
            <div className="stat-item" title="Popularity Score">
              🔥 {Math.round(book.popularity_score)}
            </div>
          )}
          
          {book.formats && (
            <div className="stat-item" title="Available Formats">
              📱 {book.formats.length} formats
            </div>
          )}
          
          <div className="stat-item" title="Book ID">
            🏷️ {book.key.split('/').pop()}
          </div>
        </div>
      </footer>
    </article>
  );
};

export default BookCard;