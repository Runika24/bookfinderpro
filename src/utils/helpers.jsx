// src/utils/helpers.js - Utility Helper Functions

// Format authors list for display
export const formatAuthors = (authors) => {
  if (!authors || authors.length === 0) {
    return 'Unknown Author';
  }
  
  if (authors.length === 1) {
    return authors[0];
  }
  
  if (authors.length === 2) {
    return authors.join(' & ');
  }
  
  if (authors.length <= 3) {
    return `${authors.slice(0, -1).join(', ')} & ${authors[authors.length - 1]}`;
  }
  
  return `${authors.slice(0, 2).join(', ')} & ${authors.length - 2} more`;
};

// Format subjects for display (limit and clean up)
export const formatSubjects = (subjects, maxCount = 3) => {
  if (!subjects || subjects.length === 0) {
    return [];
  }
  
  return subjects
    .slice(0, maxCount)
    .map(subject => {
      return subject
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    });
};

// Format publication year with era context
export const formatPublicationYear = (year) => {
  if (!year) return 'Unknown';
  
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  if (age <= 2) {
    return `${year} (New Release)`;
  } else if (age <= 5) {
    return `${year} (Recent)`;
  } else if (age <= 20) {
    return `${year} (Modern)`;
  } else if (age <= 50) {
    return `${year} (Classic)`;
  } else {
    return `${year} (Vintage)`;
  }
};

// Format page count with reading time estimate
export const formatPageCount = (pages) => {
  if (!pages) return null;
  
  const wordsPerPage = 250;
  const readingSpeed = 200;
  const totalWords = pages * wordsPerPage;
  const readingTimeMinutes = Math.ceil(totalWords / readingSpeed);
  
  const hours = Math.floor(readingTimeMinutes / 60);
  const minutes = readingTimeMinutes % 60;
  
  let readingTime = '';
  if (hours > 0) {
    readingTime = `${hours}h`;
    if (minutes > 0) {
      readingTime += ` ${minutes}m`;
    }
  } else {
    readingTime = `${minutes}m`;
  }
  
  return {
    pages,
    readingTime,
    words: totalWords
  };
};

// Format rating with context
export const formatRating = (rating, count) => {
  if (!rating) return null;
  
  const roundedRating = Math.round(rating * 10) / 10;
  
  let context = '';
  if (rating >= 4.5) context = 'Excellent';
  else if (rating >= 4.0) context = 'Very Good';
  else if (rating >= 3.5) context = 'Good';
  else if (rating >= 3.0) context = 'Fair';
  else context = 'Poor';
  
  return {
    score: roundedRating,
    context,
    count: count || 0,
    stars: generateStarRating(rating)
  };
};

// Generate star rating display
export const generateStarRating = (rating) => {
  if (!rating) return [];
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars
  };
};

// Format file size for downloads
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

// Get book cover URL with fallback
export const getBookCoverUrl = (book, size = 'M') => {
  if (book.cover_i) {
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`;
  }
  return null;
};

// Generate unique book ID for local storage
export const generateBookId = (book) => {
  return book.key || `${book.title}-${book.author_name?.[0] || 'unknown'}`.replace(/\s+/g, '-').toLowerCase();
};

// Validate ISBN
export const validateISBN = (isbn) => {
  if (!isbn) return false;
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  return /^\d{10}$/.test(cleanISBN) || /^\d{13}$/.test(cleanISBN);
};

// Calculate reading difficulty
export const calculateReadingDifficulty = (book) => {
  let difficulty = 'Intermediate';
  
  const technicalSubjects = [
    'Computer Science', 'Programming', 'Mathematics', 'Engineering',
    'Physics', 'Chemistry', 'Medicine', 'Law', 'Philosophy'
  ];
  
  const casualSubjects = [
    'Fiction', 'Romance', 'Mystery', 'Fantasy', 'Biography',
    'Travel', 'Cooking', 'Sports'
  ];
  
  if (book.subject) {
    const hasTechnical = book.subject.some(subject =>
      technicalSubjects.some(tech => subject.toLowerCase().includes(tech.toLowerCase()))
    );
    
    const hasCasual = book.subject.some(subject =>
      casualSubjects.some(casual => subject.toLowerCase().includes(casual.toLowerCase()))
    );
    
    if (hasTechnical) {
      difficulty = 'Advanced';
    } else if (hasCasual) {
      difficulty = 'Easy';
    }
  }
  
  if (book.first_publish_year && book.first_publish_year < 1950) {
    if (difficulty === 'Easy') difficulty = 'Intermediate';
    else if (difficulty === 'Intermediate') difficulty = 'Advanced';
  }
  
  return difficulty;
};

// Sort books
export const sortBooks = (books, criteria = 'relevance') => {
  const sortedBooks = [...books];
  
  switch (criteria) {
    case 'title':
      return sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
    case 'author':
      return sortedBooks.sort((a, b) => {
        const authorA = a.author_name?.[0] || 'Unknown';
        const authorB = b.author_name?.[0] || 'Unknown';
        return authorA.localeCompare(authorB);
      });
    case 'year':
      return sortedBooks.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
    case 'rating':
      return sortedBooks.sort((a, b) => (b.ratings_average || 0) - (a.ratings_average || 0));
    case 'popularity':
      return sortedBooks.sort((a, b) => {
        const popA = (a.ratings_count || 0) * (a.ratings_average || 0);
        const popB = (b.ratings_count || 0) * (b.ratings_average || 0);
        return popB - popA;
      });
    default:
      return sortedBooks;
  }
};

// Filter books
export const filterBooks = (books, filters) => {
  return books.filter(book => {
    if (filters.language && book.language) {
      if (!book.language.includes(filters.language)) return false;
    }
    if (filters.yearFrom || filters.yearTo) {
      const year = book.first_publish_year;
      if (!year) return false;
      if (filters.yearFrom && year < parseInt(filters.yearFrom)) return false;
      if (filters.yearTo && year > parseInt(filters.yearTo)) return false;
    }
    if (filters.minRating > 0) {
      if (!book.ratings_average || book.ratings_average < filters.minRating) return false;
    }
    if (filters.hasImage && !book.cover_i) return false;
    if (filters.subject && book.subject) {
      const hasSubject = book.subject.some(s => s.toLowerCase().includes(filters.subject.toLowerCase()));
      if (!hasSubject) return false;
    }
    return true;
  });
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Local storage helpers
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// URL slug
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Format numbers
export const formatNumber = (num) => {
  if (!num) return '0';
  return num.toLocaleString();
};

// Relative time
export const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

// Category colors
export const generateCategoryColor = (category) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Device detection
export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Viewport check
export const isInViewport = (element) => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Sanitize HTML
export const sanitizeHTML = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// Random recommendations
export const getRandomRecommendations = (books, count = 5) => {
  if (!books || books.length === 0) return [];
  const shuffled = [...books].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Book similarity
export const calculateBookSimilarity = (book1, book2) => {
  let similarity = 0;
  
  if (book1.author_name && book2.author_name) {
    const common_authors = book1.author_name.filter(author => book2.author_name.includes(author));
    similarity += common_authors.length * 0.3;
  }
  
  if (book1.subject && book2.subject) {
    const common_subjects = book1.subject.filter(subject => book2.subject.includes(subject));
    similarity += common_subjects.length * 0.2;
  }
  
  if (book1.first_publish_year && book2.first_publish_year) {
    const year_diff = Math.abs(book1.first_publish_year - book2.first_publish_year);
    similarity += Math.max(0, (50 - year_diff) / 50) * 0.1;
  }
  
  return Math.min(similarity, 1);
};

// Favorites import/export
export const exportFavorites = (favorites) => {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    favorites: favorites
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `bookfinder-favorites-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
};

export const importFavorites = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.favorites && Array.isArray(data.favorites)) {
          resolve(data.favorites);
        } else {
          reject(new Error('Invalid file format'));
        }
      } catch (error) {
        reject(new Error('Failed to parse file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Performance
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  };
};

// Theme utilities
export const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('bookfinder-theme', theme);
};

export const getTheme = () => {
  return localStorage.getItem('bookfinder-theme') || 'light';
};

export const toggleTheme = () => {
  const current = getTheme();
  const newTheme = current === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};

// ✅ NEW: Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
};
