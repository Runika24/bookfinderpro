
import React, { useState, useMemo } from 'react';
import { useBooks } from '../../hooks/useBooks';
import BookCard from './BookCard';
import BookModal from './BookModal';
import { sortBooks, filterBooks } from '../../utils/helpers';
import noCover from "../../assets/no-cover.jpg";
 
import './BookGrid.css';

const BookGrid = () => {
  const { books, loading, searchTerm } = useBooks();
  const [selectedBook, setSelectedBook] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    genre: '',
    rating: 0,
    year: ''
  });


  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8; 

 
  const processedBooks = useMemo(() => {
    let filtered = filterBooks(books, localFilters);
    return sortBooks(filtered, sortBy);
  }, [books, localFilters, sortBy]);

 
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = processedBooks.slice(indexOfFirstBook, indexOfLastBook);


  const stats = useMemo(() => {
    const totalBooks = processedBooks.length;
    const avgRating =
      processedBooks.filter(book => book.ratings_average).reduce((sum, book) => sum + book.ratings_average, 0) /
      processedBooks.filter(book => book.ratings_average).length;

    const genres = new Set(processedBooks.flatMap(book => book.subject || []));
    const recentBooks = processedBooks.filter(
      book => book.first_publish_year && book.first_publish_year >= new Date().getFullYear() - 5
    ).length;

    return {
      total: totalBooks,
      avgRating: avgRating ? avgRating.toFixed(1) : 'N/A',
      genres: genres.size,
      recent: recentBooks
    };
  }, [processedBooks]);

  const handleBookClick = book => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const handleSortChange = newSort => {
    setSortBy(newSort);
    setCurrentPage(1); 
  };

  const handleViewModeChange = mode => {
    setViewMode(mode);
  };

  if (loading) {
    return <div className="book-grid-loading">Loading amazing books...</div>;
  }

  if (!books.length) {
    return null; 
  }

  return (
    <section className="book-grid-section">
    
      <div className="results-header">
        <div className="results-info">
          <h2 className="results-title">
            📖 Search Results
            {searchTerm && <span className="search-term">for "{searchTerm}"</span>}
          </h2>

          <div className="results-stats">
            <div className="stat-item">
              <span className="stat-label">Found:</span>
              <span className="stat-value">{stats.total} books</span>
            </div>
            {stats.avgRating !== 'N/A' && (
              <div className="stat-item">
                <span className="stat-label">Avg Rating:</span>
                <span className="stat-value">⭐ {stats.avgRating}</span>
              </div>
            )}
            <div className="stat-item">
              <span className="stat-label">Genres:</span>
              <span className="stat-value">{stats.genres}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Recent:</span>
              <span className="stat-value">{stats.recent} books</span>
            </div>
          </div>
        </div>

      
        <div className="results-controls">
         
          <div className="sort-controls">
            <label className="control-label">Sort by:</label>
            <select className="sort-select" value={sortBy} onChange={e => handleSortChange(e.target.value)}>
              <option value="relevance">Relevance</option>
              <option value="title">Title A-Z</option>
              <option value="author">Author A-Z</option>
              <option value="year">Year (Newest)</option>
              <option value="rating">Rating (Highest)</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>

         
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('list')}
              title="List view"
            >
              ☰
            </button>
          </div>

          {/* Local Filters Toggle */}
          <button
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            🎛️ Quick Filters
          </button>
        </div>
      </div>

     
      {showFilters && (
        <div className="quick-filters-panel">
          <div className="filter-row">
            <div className="filter-group">
              <label>Genre:</label>
              <select
                value={localFilters.genre}
                onChange={e => setLocalFilters({ ...localFilters, genre: e.target.value })}
              >
                <option value="">All Genres</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Programming">Programming</option>
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Min Rating:</label>
              <select
                value={localFilters.rating}
                onChange={e => setLocalFilters({ ...localFilters, rating: parseFloat(e.target.value) })}
              >
                <option value={0}>Any Rating</option>
                <option value={3.0}>3.0+ ⭐</option>
                <option value={4.0}>4.0+ ⭐</option>
                <option value={4.5}>4.5+ ⭐</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Era:</label>
              <select
                value={localFilters.year}
                onChange={e => setLocalFilters({ ...localFilters, year: e.target.value })}
              >
                <option value="">Any Year</option>
                <option value="recent">Recent (2020+)</option>
                <option value="modern">Modern (2000+)</option>
                <option value="classic">Classic (Before 2000)</option>
              </select>
            </div>

            <button
              className="clear-filters-btn"
              onClick={() => setLocalFilters({ genre: '', rating: 0, year: '' })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* No Results After Filtering */}
      {processedBooks.length === 0 && books.length > 0 && (
        <div className="no-filtered-results">
          <div className="no-results-icon">🔍</div>
          <h3>No books match your current filters</h3>
          <p>Try adjusting your filters or search terms</p>
          <button
            className="clear-all-btn"
            onClick={() => {
              setLocalFilters({ genre: '', rating: 0, year: '' });
              setSortBy('relevance');
              setCurrentPage(1);
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Books Grid/List */}
      {processedBooks.length > 0 && (
        <div className={`books-container ${viewMode}`}>
          <div className={`books-${viewMode}`}>
            {currentBooks.map((book, index) => (
<BookCard
  key={`${book.key}-${index}`}
  book={{
    ...book,
    coverUrl: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : noCover
  }}
  onDetailsClick={handleBookClick}
  viewMode={viewMode}
  index={index}
/>
            ))}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {processedBooks.length > booksPerPage && (
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            ⬅ Prev
          </button>

          {Array.from({ length: Math.ceil(processedBooks.length / booksPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage(prev => Math.min(prev + 1, Math.ceil(processedBooks.length / booksPerPage)))
            }
            disabled={currentPage === Math.ceil(processedBooks.length / booksPerPage)}
          >
            Next ➡
          </button>
        </div>
      )}

      {/* Pagination Info */}
      <div className="pagination-info">
        <p>
          Showing <strong>{currentBooks.length}</strong> of {processedBooks.length} books
          {searchTerm && ` matching "${searchTerm}"`}
          {sortBy !== 'relevance' && ` sorted by ${sortBy}`}
        </p>
      </div>

      {/* Book Details Modal */}
      {selectedBook && <BookModal book={selectedBook} onClose={handleCloseModal} />}

      {/* Keyboard Navigation Help */}
      <div className="keyboard-help">
        <p>
          💡 <strong>Tip:</strong> Use arrow keys to navigate, Enter to select, Esc to close modals
        </p>
      </div>
    </section>
  );
};

export default BookGrid;
