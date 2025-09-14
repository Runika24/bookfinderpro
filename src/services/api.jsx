// src/services/api.js - API Configuration and Base Functions

// API Base Configuration
export const API_BASE_URL = 'https://openlibrary.org';

// API Endpoints
export const API_ENDPOINTS = {
  SEARCH: '/search.json',
  WORKS: '/works',
  AUTHORS: '/authors',
  COVERS: 'https://covers.openlibrary.org/b'
};

// API Request Limits
export const API_LIMITS = {
  MAX_RESULTS: 50,
  DEFAULT_RESULTS: 20,
  MIN_RESULTS: 5,
  TIMEOUT: 10000 // 10 seconds
};

// Default request headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// API Request wrapper with error handling
export const apiRequest = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers
    },
    timeout: API_LIMITS.TIMEOUT
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error - please check your connection');
    }

    throw error;
  }
};

// Build search URL with parameters
export const buildSearchURL = (searchParams) => {
  const {
    query,
    type = 'title',
    limit = API_LIMITS.DEFAULT_RESULTS,
    offset = 0,
    fields = null
  } = searchParams;

  let url = `${API_BASE_URL}${API_ENDPOINTS.SEARCH}`;
  const params = new URLSearchParams();

  // Add search parameter based on type
  switch (type) {
    case 'title':
      params.append('title', query);
      break;
    case 'author':
      params.append('author', query);
      break;
    case 'subject':
      params.append('subject', query);
      break;
    case 'isbn':
      params.append('isbn', query);
      break;
    default:
      params.append('q', query);
  }

  // Add other parameters
  params.append('limit', Math.min(limit, API_LIMITS.MAX_RESULTS));
  
  if (offset > 0) {
    params.append('offset', offset);
  }

  if (fields) {
    params.append('fields', fields);
  }

  return `${url}?${params.toString()}`;
};

// Get book cover URL
export const getCoverURL = (coverId, size = 'M') => {
  if (!coverId) return null;
  
  const validSizes = ['S', 'M', 'L'];
  const coverSize = validSizes.includes(size) ? size : 'M';
  
  return `${API_ENDPOINTS.COVERS}/id/${coverId}-${coverSize}.jpg`;
};

// Get author photo URL
export const getAuthorPhotoURL = (authorId, size = 'M') => {
  if (!authorId) return null;
  
  const validSizes = ['S', 'M', 'L'];
  const photoSize = validSizes.includes(size) ? size : 'M';
  
  return `${API_ENDPOINTS.COVERS}/a/olid/${authorId}-${photoSize}.jpg`;
};

// Validate API response
export const validateResponse = (response, expectedFields = []) => {
  if (!response) {
    throw new Error('Empty response received');
  }

  if (expectedFields.length > 0) {
    const missingFields = expectedFields.filter(field => !(field in response));
    if (missingFields.length > 0) {
      console.warn(`Missing expected fields: ${missingFields.join(', ')}`);
    }
  }

  return true;
};

// Rate limiting helper
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // 100ms between requests

export const rateLimitedRequest = async (requestFunction) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return await requestFunction();
};

// Cache for API responses (simple in-memory cache)
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cachedApiRequest = async (url, options = {}) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const cached = apiCache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await apiRequest(url, options);
  
  apiCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  // Clean old cache entries
  if (apiCache.size > 100) {
    const oldestKey = apiCache.keys().next().value;
    apiCache.delete(oldestKey);
  }
  
  return data;
};

// Error handling utilities
export const handleApiError = (error, context = '') => {
  console.error(`API Error ${context}:`, error);
  
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  if (error.message.includes('network') || error.message.includes('fetch')) {
    return 'Network error. Please check your internet connection.';
  }
  
  if (error.message.includes('404')) {
    return 'Requested resource not found.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  return 'Something went wrong. Please try again.';
};