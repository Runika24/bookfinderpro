



export const APP_CONFIG = {
  name: 'BookFinder Pro',
  version: '1.0.0',
  description: 'Professional book search application for college students',
  author: 'Alex - College Student',
  repository: 'https://github.com/alex/book-finder-pro',
  buildDate: new Date().toISOString()
};


export const API_CONFIG = {
  baseUrl: 'https://openlibrary.org',
  endpoints: {
    search: '/search.json',
    works: '/works',
    authors: '/authors',
    covers: 'https://covers.openlibrary.org/b'
  },
  limits: {
    maxResults: 50,
    defaultResults: 20,
    minResults: 5,
    timeout: 10000
  },
  fields: [
    'key',
    'title', 
    'author_name',
    'cover_i',
    'first_publish_year',
    'subject',
    'publisher',
    'language',
    'isbn',
    'ratings_average',
    'ratings_count',
    'number_of_pages_median'
  ]
};


export const SEARCH_CONFIG = {
  types: [
    { value: 'title', label: 'Title', placeholder: 'Enter book title...', icon: '📖' },
    { value: 'author', label: 'Author', placeholder: 'Enter author name...', icon: '👤' },
    { value: 'subject', label: 'Subject', placeholder: 'Enter subject or genre...', icon: '🏷️' },
    { value: 'isbn', label: 'ISBN', placeholder: 'Enter ISBN number...', icon: '🔢' }
  ],
  filters: {
    languages: [
      { value: '', label: 'Any Language' },
      { value: 'eng', label: 'English' },
      { value: 'spa', label: 'Spanish' },
      { value: 'fre', label: 'French' },
      { value: 'ger', label: 'German' },
      { value: 'ita', label: 'Italian' },
      { value: 'por', label: 'Portuguese' },
      { value: 'rus', label: 'Russian' },
      { value: 'chi', label: 'Chinese' },
      { value: 'jpn', label: 'Japanese' }
    ],
    ratings: [
      { value: 0, label: 'Any Rating' },
      { value: 3.0, label: '3.0+ Stars ⭐⭐⭐' },
      { value: 3.5, label: '3.5+ Stars ⭐⭐⭐⭐' },
      { value: 4.0, label: '4.0+ Stars ⭐⭐⭐⭐' },
      { value: 4.5, label: '4.5+ Stars ⭐⭐⭐⭐⭐' }
    ],
    yearRanges: [
      { value: '', label: 'Any Year' },
      { value: 'recent', label: 'Recent (2020+)', from: 2020, to: new Date().getFullYear() },
      { value: 'modern', label: 'Modern (2000+)', from: 2000, to: new Date().getFullYear() },
      { value: '90s', label: '1990s', from: 1990, to: 1999 },
      { value: 'classic', label: 'Classic (Before 1990)', from: 0, to: 1989 }
    ]
  },
  sortOptions: [
    { value: 'relevance', label: 'Relevance', icon: '🎯' },
    { value: 'title', label: 'Title A-Z', icon: '🔤' },
    { value: 'author', label: 'Author A-Z', icon: '👤' },
    { value: 'year', label: 'Year (Newest)', icon: '📅' },
    { value: 'rating', label: 'Rating (Highest)', icon: '⭐' },
    { value: 'popularity', label: 'Popularity', icon: '🔥' }
  ]
};


export const POPULAR_SEARCHES = {
  programming: [
    'Python Programming',
    'JavaScript Fundamentals',
    'React Development', 
    'Clean Code',
    'Design Patterns',
    'Algorithms and Data Structures',
    'Web Development',
    'Software Engineering'
  ],
  science: [
    'Machine Learning',
    'Data Science',
    'Artificial Intelligence',
    'Physics',
    'Chemistry',
    'Biology',
    'Mathematics',
    'Statistics'
  ],
  business: [
    'Entrepreneurship',
    'Marketing',
    'Economics',
    'Leadership',
    'Project Management',
    'Business Strategy',
    'Finance',
    'Accounting'
  ],
  literature: [
    'Classic Literature',
    'Modern Fiction',
    'Poetry',
    'Drama',
    'Short Stories',
    'Literary Criticism',
    'Creative Writing',
    'World Literature'
  ],
  academic: [
    'Computer Science',
    'Engineering',
    'Philosophy',
    'Psychology',
    'History',
    'Political Science',
    'Sociology',
    'Education'
  ]
};


export const UI_CONFIG = {
  themes: {
    light: {
      name: 'Light Theme',
      icon: '☀️',
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40'
      }
    },
    dark: {
      name: 'Dark Theme', 
      icon: '🌙',
      colors: {
        primary: '#0d6efd',
        secondary: '#6c757d',
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0dcaf0',
        light: '#f8f9fa',
        dark: '#212529'
      }
    }
  },
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px', 
    lg: '992px',
    xl: '1200px',
    xxl: '1400px'
  },
  animations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  zIndices: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  }
};


export const ERROR_MESSAGES = {
  network: 'Unable to connect. Please check your internet connection.',
  timeout: 'Request timed out. Please try again.',
  notFound: 'No books found matching your search.',
  rateLimit: 'Too many requests. Please wait before searching again.',
  server: 'Server error. Please try again later.',
  generic: 'Something went wrong. Please try again.',
  validation: {
    required: 'This field is required.',
    minLength: 'Please enter at least {min} characters.',
    maxLength: 'Please enter no more than {max} characters.',
    invalidIsbn: 'Please enter a valid ISBN number.',
    invalidYear: 'Please enter a valid year between 1000 and {currentYear}.'
  }
};


export const SUCCESS_MESSAGES = {
  bookAdded: 'Book added to favorites!',
  bookRemoved: 'Book removed from favorites.',
  searchCompleted: 'Search completed successfully.',
  filterApplied: 'Filters applied successfully.',
  dataSaved: 'Your preferences have been saved.',
  bookshared: 'Book link copied to clipboard!'
};


export const LOADING_MESSAGES = [
  '🔍 Searching through millions of books...',
  '📚 Finding the perfect matches for you...',
  '⭐ Discovering highly-rated books...',
  '🎯 Filtering by your preferences...',
  '📖 Almost there, preparing your results...',
  '🔗 Connecting to our book database...',
  '🧠 Processing your search query...',
  '📊 Analyzing book recommendations...'
];


export const BOOK_CATEGORIES = {
  academic: {
    name: 'Academic',
    icon: '🎓',
    subjects: ['Computer Science', 'Mathematics', 'Engineering', 'Physics', 'Chemistry']
  },
  fiction: {
    name: 'Fiction',
    icon: '📚',
    subjects: ['Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy']
  },
  nonfiction: {
    name: 'Non-Fiction',
    icon: '📖',
    subjects: ['Biography', 'History', 'Science', 'Philosophy', 'Self-help']
  },
  reference: {
    name: 'Reference',
    icon: '📋',
    subjects: ['Dictionary', 'Encyclopedia', 'Handbook', 'Manual', 'Guide']
  },
  textbooks: {
    name: 'Textbooks',
    icon: '📓',
    subjects: ['Textbook', 'Study Guide', 'Workbook', 'Course Material']
  }
};


export const READING_LEVELS = {
  beginner: {
    name: 'Beginner',
    icon: '🌱',
    description: 'Easy to read, introductory level',
    color: '#28a745'
  },
  intermediate: {
    name: 'Intermediate', 
    icon: '📚',
    description: 'Moderate difficulty, some background helpful',
    color: '#ffc107'
  },
  advanced: {
    name: 'Advanced',
    icon: '🎓',
    description: 'Complex topics, requires significant background',
    color: '#dc3545'
  },
  expert: {
    name: 'Expert',
    icon: '👨‍🔬',
    description: 'Highly technical, for specialists',
    color: '#6f42c1'
  }
};


export const STORAGE_KEYS = {
  favorites: 'bookfinder-favorites',
  recentSearches: 'bookfinder-recent-searches',
  searchHistory: 'bookfinder-search-history',
  userPreferences: 'bookfinder-preferences',
  readingLists: 'bookfinder-reading-lists',
  theme: 'bookfinder-theme',
  filters: 'bookfinder-filters',
  viewMode: 'bookfinder-view-mode'
};



export const ANALYTICS_EVENTS = {
  search: 'book_search',
  bookView: 'book_view_details',
  bookFavorite: 'book_add_favorite',
  bookUnfavorite: 'book_remove_favorite',
  filterApply: 'search_filter_apply',
  sortChange: 'search_sort_change',
  categorySelect: 'category_select',
  errorOccurred: 'error_occurred'
};


export const FEATURES = {
  darkMode: true,
  advancedFilters: true,
  bookReviews: false,
  socialSharing: true,
  offlineMode: false,
  voiceSearch: false,
  barCodeScanner: false,
  aiRecommendations: false
};


export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  maxPagesShown: 5,
  showQuickJumper: true
};


export const BOOK_FORMATS = {
  physical: {
    name: 'Physical Book',
    icon: '📚',
    color: '#8B4513'
  },
  ebook: {
    name: 'eBook',
    icon: '📱',
    color: '#007bff'
  },
  audiobook: {
    name: 'Audiobook',
    icon: '🎧',
    color: '#28a745'
  },
  pdf: {
    name: 'PDF',
    icon: '📄',
    color: '#dc3545'
  }
};


export const SOCIAL_PLATFORMS = {
  twitter: {
    name: 'Twitter',
    icon: '🐦',
    shareUrl: 'https://twitter.com/intent/tweet?text={text}&url={url}'
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    shareUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    shareUrl: 'https://www.linkedin.com/sharing/share-offsite/?url={url}'
  },
  reddit: {
    name: 'Reddit',
    icon: '🤖',
    shareUrl: 'https://reddit.com/submit?url={url}&title={title}'
  }
};


export const PERFORMANCE_CONFIG = {
  searchDebounceMs: 300,
  imageLoadTimeoutMs: 5000,
  apiTimeoutMs: 10000,
  cacheExpiryMs: 300000,
  maxCacheSize: 100,
  lazyLoadOffset: '100px'
};


export const VALIDATION_RULES = {
  search: {
    minLength: 1,
    maxLength: 200
  },
  isbn: {
    pattern: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
  },
  year: {
    min: 1000,
    max: new Date().getFullYear() + 10
  }
};


export const DEFAULT_PREFERENCES = {
  theme: 'light',
  viewMode: 'grid',
  booksPerPage: 20,
  autoSave: true,
  showCovers: true,
  showRatings: true,
  defaultSearchType: 'title',
  language: 'eng'
};


export const KEYBOARD_SHORTCUTS = {
  search: '/',
  clearSearch: 'Escape',
  toggleTheme: 't',
  toggleFilters: 'f',
  nextPage: 'ArrowRight',
  prevPage: 'ArrowLeft',
  selectFirst: 'Enter',
  closeModal: 'Escape'
};


export const CONTACT_INFO = {
  email: 'alex@college.edu',
  github: 'https://github.com/alex/book-finder-pro',
  linkedin: 'https://linkedin.com/in/alex-student',
  supportUrl: 'https://bookfinder-pro.herokuapp.com/support'
};


export const CONSTANTS = {
  APP_CONFIG,
  API_CONFIG,
  SEARCH_CONFIG,
  POPULAR_SEARCHES,
  UI_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  BOOK_CATEGORIES,
  READING_LEVELS,
  STORAGE_KEYS,
  ANALYTICS_EVENTS,
  FEATURES,
  PAGINATION_CONFIG,
  BOOK_FORMATS,
  SOCIAL_PLATFORMS,
  PERFORMANCE_CONFIG,
  VALIDATION_RULES,
  DEFAULT_PREFERENCES,
  KEYBOARD_SHORTCUTS,
  CONTACT_INFO
};

export default CONSTANTS;