// src/components/books/BookModal.js - Detailed Book Information Modal
import React, { useState, useEffect } from 'react';
import { useBooks } from '../../hooks/useBooks';
import { getCoverURL } from '../../services/api';
import { formatAuthors, formatSubjects, copyToClipboard } from '../../utils/helpers';
import './BookModal.css';

const BookModal = ({ book, onClose }) => {
  const { toggleFavorite, isBookFavorited } = useBooks();
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isFavorite = isBookFavorited(book);
  const coverUrl = getCoverURL(book.cover_i, 'L');

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(book);
  };

  const handleShare = async () => {
    const shareData = {
      title: book.title,
      text: `Check out this book: ${book.title} by ${formatAuthors(book.author_name)}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await copyToClipboard(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const renderRatingStars = (rating) => {
    if (!rating) return <span className="no-rating">No rating available</span>;
    
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
    
    return (
      <div className="rating-display">
        <div className="stars">{stars}</div>
        <span className="rating-score">{rating.toFixed(1)}</span>
        {book.ratings_count && (
          <span className="rating-count">({book.ratings_count.toLocaleString()} ratings)</span>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: '📖 Overview', icon: '📖' },
    { id: 'details', label: '📋 Details', icon: '📋' },
    { id: 'subjects', label: '🏷️ Topics', icon: '🏷️' },
    { id: 'editions', label: '📚 Editions', icon: '📚' }
  ];

  return (
    <div className="book-modal-overlay" onClick={handleBackdropClick}>
      <div className="book-modal">
        {/* Modal Header */}
        <header className="modal-header">
          <div className="header-content">
            <h1 className="modal-title">{book.title}</h1>
            <p className="modal-authors">by {formatAuthors(book.author_name)}</p>
          </div>
          
          <div className="header-actions">
            <button 
              className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
              onClick={handleFavoriteToggle}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
            
            <button 
              className="share-btn"
              onClick={handleShare}
              title="Share this book"
            >
              {copied ? '✅' : '📤'}
            </button>
            
            <button 
              className="close-btn"
              onClick={onClose}
              title="Close modal"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Book Cover and Quick Info */}
          <div className="book-showcase">
            <div className="book-cover-section">
              {coverUrl ? (
                <div className="cover-container">
                  {!imageLoaded && <div className="cover-skeleton"></div>}
                  <img
                    src={coverUrl}
                    alt={`Cover of ${book.title}`}
                    className={`book-cover-large ${imageLoaded ? 'loaded' : ''}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
              ) : (
                <div className="cover-placeholder-large">
                  <div className="placeholder-icon">📚</div>
                  <p>No cover available</p>
                </div>
              )}
            </div>

            <div className="quick-info">
              {/* Rating */}
              {book.ratings_average && (
                <div className="info-section">
                  <h3>⭐ Rating</h3>
                  {renderRatingStars(book.ratings_average)}
                </div>
              )}

              {/* Quick Stats */}
              <div className="quick-stats">
                {book.first_publish_year && (
                  <div className="stat">
                    <span className="stat-label">📅 Published</span>
                    <span className="stat-value">{book.first_publish_year}</span>
                  </div>
                )}
                
                {book.number_of_pages_median && (
                  <div className="stat">
                    <span className="stat-label">📄 Pages</span>
                    <span className="stat-value">{book.number_of_pages_median}</span>
                  </div>
                )}
                
                {book.estimated_read_time && (
                  <div className="stat">
                    <span className="stat-label">⏰ Read Time</span>
                    <span className="stat-value">{book.estimated_read_time}h</span>
                  </div>
                )}
                
                {book.reading_level && (
                  <div className="stat">
                    <span className="stat-label">🎓 Level</span>
                    <span className="stat-value">{book.reading_level}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="action-btn primary">
                  📚 Want to Read
                </button>
                <button className="action-btn secondary">
                  📖 Mark as Read
                </button>
                <button className="action-btn secondary">
                  📝 Add Review
                </button>
              </div>
            </div>
          </div>

          {/* Tabbed Content */}
          <div className="tabbed-content">
            {/* Tab Navigation */}
            <nav className="tab-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="tab-panel">
                  <h3>📖 Book Overview</h3>
                  
                  {book.subtitle && (
                    <div className="overview-section">
                      <h4>Subtitle</h4>
                      <p>{book.subtitle}</p>
                    </div>
                  )}

                  <div className="overview-section">
                    <h4>Summary</h4>
                    <p>
                      This book "{book.title}" by {formatAuthors(book.author_name)} 
                      {book.first_publish_year && ` was first published in ${book.first_publish_year}`}.
                      {book.number_of_pages_median && ` It contains approximately ${book.number_of_pages_median} pages`}
                      {book.estimated_read_time && ` and has an estimated reading time of ${book.estimated_read_time} hours`}.
                    </p>
                  </div>

                  {book.subject && book.subject.length > 0 && (
                    <div className="overview-section">
                      <h4>Main Topics</h4>
                      <div className="topic-tags">
                        {formatSubjects(book.subject, 8).map((subject, index) => (
                          <span key={index} className="topic-tag">{subject}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="tab-panel">
                  <h3>📋 Book Details</h3>
                  
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">📖 Title</span>
                      <span className="detail-value">{book.title}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">👥 Authors</span>
                      <span className="detail-value">{formatAuthors(book.author_name)}</span>
                    </div>

                    {book.first_publish_year && (
                      <div className="detail-item">
                        <span className="detail-label">📅 First Published</span>
                        <span className="detail-value">{book.first_publish_year}</span>
                      </div>
                    )}

                    {book.publisher && book.publisher.length > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">🏢 Publishers</span>
                        <span className="detail-value">{book.publisher.slice(0, 3).join(', ')}</span>
                      </div>
                    )}

                    {book.language && book.language.length > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">🌍 Languages</span>
                        <span className="detail-value">{book.language.join(', ')}</span>
                      </div>
                    )}

                    {book.isbn && book.isbn.length > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">🏷️ ISBN</span>
                        <span className="detail-value">{book.isbn[0]}</span>
                      </div>
                    )}

                    {book.number_of_pages_median && (
                      <div className="detail-item">
                        <span className="detail-label">📄 Page Count</span>
                        <span className="detail-value">{book.number_of_pages_median} pages</span>
                      </div>
                    )}

                    {book.availability_status && (
                      <div className="detail-item">
                        <span className="detail-label">📦 Availability</span>
                        <span className="detail-value">{book.availability_status}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'subjects' && (
                <div className="tab-panel">
                  <h3>🏷️ Topics & Subjects</h3>
                  
                  {book.subject && book.subject.length > 0 ? (
                    <div className="subjects-section">
                      <p>This book covers the following topics and subjects:</p>
                      <div className="subjects-cloud">
                        {formatSubjects(book.subject, 20).map((subject, index) => (
                          <span 
                            key={index} 
                            className="subject-tag"
                            style={{
                              fontSize: `${Math.random() * 0.5 + 1}em`,
                              opacity: Math.random() * 0.3 + 0.7
                            }}
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p>No subject information available for this book.</p>
                  )}
                </div>
              )}

              {activeTab === 'editions' && (
                <div className="tab-panel">
                  <h3>📚 Available Editions</h3>
                  
                  <div className="editions-info">
                    <div className="edition-item">
                      <h4>📖 Print Edition</h4>
                      <p>Traditional paperback and hardcover editions</p>
                      <span className="availability">✅ Usually Available</span>
                    </div>

                    {book.cover_i && (
                      <div className="edition-item">
                        <h4>💻 Digital Edition</h4>
                        <p>eBook format for digital reading</p>
                        <span className="availability">✅ Available</span>
                      </div>
                    )}

                    <div className="edition-item">
                      <h4>🎧 Audio Edition</h4>
                      <p>Audiobook version for listening</p>
                      <span className="availability">❓ Check availability</span>
                    </div>

                    {book.isbn && (
                      <div className="isbn-info">
                        <h4>📋 Edition Information</h4>
                        <p><strong>Primary ISBN:</strong> {book.isbn[0]}</p>
                        {book.isbn.length > 1 && (
                          <p><strong>Other ISBNs:</strong> {book.isbn.slice(1, 3).join(', ')}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="modal-footer">
          <div className="footer-info">
            <span>📚 Book ID: {book.key.split('/').pop()}</span>
            <span>🔗 Source: Open Library</span>
          </div>
          
          <div className="footer-actions">
            <button className="footer-btn" onClick={handleShare}>
              📤 Share Book
            </button>
            <button className="footer-btn" onClick={onClose}>
              ✅ Done
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BookModal;