// src/hooks/useBooks.js - Custom Hook for Book Operations
import { useBooksContext } from '../context/BooksContext';
import { useEffect } from 'react';

export const useBooks = () => {
  const context = useBooksContext();
  
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }

  const {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    books,
    setBooks,
    loading,
    setLoading,
    error,
    setError,
    favorites,
    setFavorites,
    filters,
    setFilters,
    searchBooks,
    toggleFavorite,
    loadFavorites,
    clearError,
    clearResults,
    updateFilters
  } = context;

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Additional helper functions
  const isBookFavorited = (book) => {
    return favorites.some(fav => fav.key === book.key);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  const getBooksByGenre = (genre) => {
    return books.filter(book => 
      book.subject && book.subject.includes(genre)
    );
  };

  const searchWithDelay = (term, delay = 300) => {
    const timeoutId = setTimeout(() => {
      searchBooks(term);
    }, delay);

    return () => clearTimeout(timeoutId);
  };

  const getPopularBooks = () => {
    return books
      .filter(book => book.ratings_count && book.ratings_average)
      .sort((a, b) => 
        (b.ratings_count * b.ratings_average) - (a.ratings_count * a.ratings_average)
      )
      .slice(0, 10);
  };

  const getRecentBooks = () => {
    return books
      .filter(book => book.first_publish_year && book.first_publish_year >= 2020)
      .sort((a, b) => b.first_publish_year - a.first_publish_year);
  };

  return {
    // Core state
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    books,
    setBooks,
    loading,
    setLoading,
    error,
    setError,
    favorites,
    setFavorites,
    filters,
    setFilters,
    
    // Core functions
    searchBooks,
    toggleFavorite,
    clearError,
    clearResults,
    updateFilters,
    
    // Helper functions
    isBookFavorited,
    getFavoritesCount,
    getBooksByGenre,
    searchWithDelay,
    getPopularBooks,
    getRecentBooks
  };
};
