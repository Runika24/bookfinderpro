
import React, { createContext, useContext, useState } from 'react';
import { searchBooks as apiSearchBooks } from '../services/bookService';

const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    language: '',
    yearFrom: '',
    yearTo: '',
    hasImage: false,
    minRating: 0
  });

  
  const searchBooks = async (term = searchTerm, type = searchType) => {
    if (!term.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const results = await apiSearchBooks(term, type, filters);
      
      if (results && results.length > 0) {
        setBooks(results);
      } else {
        setBooks([]);
        setError('No books found. Try different keywords or check spelling.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Network error. Please check your connection and try again.');
      setBooks([]);
    }
    
    setLoading(false);
  };

  
  const toggleFavorite = (book) => {
    const isFavorite = favorites.some(fav => fav.key === book.key);
    
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.key !== book.key));
    } else {
      setFavorites([...favorites, book]);
    }
    
    
    const newFavorites = isFavorite 
      ? favorites.filter(fav => fav.key !== book.key)
      : [...favorites, book];
    
    localStorage.setItem('bookfinder-favorites', JSON.stringify(newFavorites));
  };

  
  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem('bookfinder-favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

 
  const clearError = () => setError('');

  
  const clearResults = () => {
    setBooks([]);
    setSearchTerm('');
    setError('');
  };

  
  const updateFilters = (newFilters) => {
    setFilters(prev => ({...prev, ...newFilters}));
  };

  
  const value = {
    
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
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
};


export const useBooksContext = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooksContext must be used within a BooksProvider');
  }
  return context;
};

export default BooksContext;