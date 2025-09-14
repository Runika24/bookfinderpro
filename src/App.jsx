// App.js - Main Application Component
import React from 'react';
import { BooksProvider } from './context/BooksContext';
import Header from './components/common/Header';
import SearchSection from './components/search/SearchSection';
import BookGrid from './components/books/BookGrid';
import LoadingSpinner from './components/common/LoadingSpinner';
import EmptyState from './components/common/EmptyState';
import ErrorMessage from './components/common/ErrorMessage';
import { useBooks } from './hooks/useBooks';
import './App.css';

const AppContent = () => {
  const { books, loading } = useBooks();

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <SearchSection />
        <ErrorMessage />
        {loading ? (
          <LoadingSpinner />
        ) : books.length > 0 ? (
          <BookGrid />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BooksProvider>
      <AppContent />
    </BooksProvider>
  );
};

export default App;