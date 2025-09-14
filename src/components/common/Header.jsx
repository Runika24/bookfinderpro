
import React, { useState } from 'react';
import { useBooks } from '../../hooks/useBooks';
import BookModal from '../books/BookModal'; 
import noCover from "../../assets/no-cover.jpg";

import './Header.css';

const Header = () => {
  const { favorites, getFavoritesCount, clearResults } = useBooks();
  const [showStats, setShowStats] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null); 
  const handleLogoClick = () => {
    clearResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book); 
  };

 const closeModal = () => {
  setSelectedBook(null);
  setShowStats(false) ;
};

  return (
    <header className="header">
      <div className="header-container">
       
        <div className="header-left" onClick={handleLogoClick}>
          <div className="logo">📚</div>
          <div className="header-title">
            <h1>BookFinder Pro</h1>
            <p className="subtitle">Discover your next great read</p>
          </div>
        </div>

      
        <div className="header-center">
          <div className="app-description">Built for Alex - College Student</div>
        </div>

      
        <div className={`header-right ${menuOpen ? 'open' : ''}`}>
          <div className="header-stats">
            {getFavoritesCount() > 0 && (
              <div 
                className="favorites-badge"
                onClick={toggleStats}
                title="View favorites"
              >
                <span className="favorites-icon">❤️</span>
                <span className="favorites-count">{getFavoritesCount()}</span>
                <span className="favorites-label">favorites</span>
              </div>
            )}
          </div>

          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={() => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                document.documentElement.setAttribute(
                  'data-theme', 
                  currentTheme === 'dark' ? 'light' : 'dark'
                );
              }}
              title="Toggle theme"
            >
              🌙
            </button>

            <div className="app-version">v1.0</div>
          </div>
        </div>

        
        <div className="hamburger" onClick={toggleMenu}>
          ☰
        </div>
      </div>

      
      {showStats && getFavoritesCount() > 0 && (
        <div className="stats-dropdown">
          <div className="stats-container">
            <h3>Your Favorite Books</h3>

           
            <div className="favorites-grid">
              {favorites.map((book) => (
                <div 
                  key={book.key} 
                  className="favorite-card"
                  onClick={() => handleBookClick(book)} 
                >
<img
  src={
    book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : noCover
  }
  alt={book.title}
  className="favorite-cover"
/>
                  <div className="favorite-info">
                    <h4>{book.title}</h4>
                    <p>{book.author_name?.join(', ') || 'Unknown Author'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      
      {selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={closeModal} 
        />
      )}

      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>
    </header>
  );
};

export default Header;
