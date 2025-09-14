
import { API_BASE_URL, API_ENDPOINTS } from './api';


export const searchBooks = async (term, type = 'title', filters = {}) => {
  try {
    let url = '';
    const limit = 24;
    const fields = 'key,title,author_name,cover_i,first_publish_year,subject,publisher,language,isbn,ratings_average,ratings_count,number_of_pages_median';
    
  
    switch(type) {
      case 'title':
        url = `${API_BASE_URL}${API_ENDPOINTS.SEARCH}?title=${encodeURIComponent(term)}&limit=${limit}&fields=${fields}`;
        break;
      case 'author':
        url = `${API_BASE_URL}${API_ENDPOINTS.SEARCH}?author=${encodeURIComponent(term)}&limit=${limit}&fields=${fields}`;
        break;
      case 'subject':
        url = `${API_BASE_URL}${API_ENDPOINTS.SEARCH}?subject=${encodeURIComponent(term)}&limit=${limit}&fields=${fields}`;
        break;
      case 'isbn':
        url = `${API_BASE_URL}${API_ENDPOINTS.SEARCH}?isbn=${encodeURIComponent(term)}&limit=${limit}&fields=${fields}`;
        break;
      default:
        url = `${API_BASE_URL}${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(term)}&limit=${limit}&fields=${fields}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.docs && data.docs.length > 0) {
      let filteredBooks = data.docs.filter(book => book.title);
      
      
      filteredBooks = applyFilters(filteredBooks, filters);
      
      
      const enhancedBooks = filteredBooks.map(book => enhanceBookData(book));
      
      
      enhancedBooks.sort((a, b) => b.popularity_score - a.popularity_score);
      
      return enhancedBooks;
    }
    
    return [];
    
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('Failed to search books. Please check your connection.');
  }
};


const applyFilters = (books, filters) => {
  let filtered = [...books];
  

  if (filters.language) {
    filtered = filtered.filter(book => 
      book.language && book.language.includes(filters.language)
    );
  }
  
  
  if (filters.yearFrom || filters.yearTo) {
    filtered = filtered.filter(book => {
      if (!book.first_publish_year) return false;
      const year = book.first_publish_year;
      const fromYear = filters.yearFrom ? parseInt(filters.yearFrom) : 0;
      const toYear = filters.yearTo ? parseInt(filters.yearTo) : 9999;
      return year >= fromYear && year <= toYear;
    });
  }
  
 
  if (filters.hasImage) {
    filtered = filtered.filter(book => book.cover_i);
  }
  
 
  if (filters.minRating > 0) {
    filtered = filtered.filter(book => 
      book.ratings_average && book.ratings_average >= filters.minRating
    );
  }
  
  return filtered;
};


const enhanceBookData = (book) => {
  return {
    ...book,
    
    popularity_score: (book.ratings_count || 0) * (book.ratings_average || 0),
    
    
    estimated_read_time: book.number_of_pages_median 
      ? Math.ceil((book.number_of_pages_median * 250) / (200 * 60)) 
      : null,
    
    
    genre_primary: book.subject ? book.subject[0] : 'General',
    
    
    availability_status: Math.random() > 0.3 ? 'Available' : 'Limited',
    
    
    reading_level: determineReadingLevel(book),
    
   
    formats: determineFormats(book)
  };
};


const determineReadingLevel = (book) => {
  if (book.subject) {
    const technicalSubjects = ['Computer Science', 'Programming', 'Mathematics', 'Engineering'];
    const hasTechnical = book.subject.some(subject => 
      technicalSubjects.some(tech => subject.includes(tech))
    );
    
    if (hasTechnical) return 'Advanced';
  }
  
  if (book.first_publish_year && book.first_publish_year < 1950) {
    return 'Classic';
  }
  
  return 'Intermediate';
};


const determineFormats = (book) => {
  const formats = ['Print'];
  
  if (book.cover_i) {
    formats.push('Digital');
  }
  
  if (Math.random() > 0.7) {
    formats.push('Audio');
  }
  
  return formats;
};


export const getBookDetails = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/works/${bookId}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw new Error('Failed to fetch book details.');
  }
};


export const getAuthorDetails = async (authorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/authors/${authorId}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error fetching author details:', error);
    throw new Error('Failed to fetch author details.');
  }
};


export const getTrendingBooks = async () => {
  const trendingTerms = ['Python', 'JavaScript', 'React', 'Machine Learning', 'Data Science'];
  const randomTerm = trendingTerms[Math.floor(Math.random() * trendingTerms.length)];
  
  return await searchBooks(randomTerm, 'subject');
};


export const getSearchSuggestions = (partialQuery) => {
  const suggestions = [
    'Python Programming',
    'JavaScript Fundamentals', 
    'React Development',
    'Machine Learning',
    'Data Structures',
    'Web Development',
    'Computer Science',
    'Software Engineering',
    'Algorithm Design',
    'Database Systems'
  ];
  
  return suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(partialQuery.toLowerCase())
  ).slice(0, 5);
};