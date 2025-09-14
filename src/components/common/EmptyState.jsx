
import React, { useState } from 'react';
import { useBooks } from '../../hooks/useBooks';
import './EmptyState.css';

const EmptyState = ({ type = 'initial' }) => {
  const { setSearchTerm, searchBooks, searchTerm, error } = useBooks();
  const [showTips, setShowTips] = useState(false);


  const states = {
    initial: {
      icon: '📚',
      title: 'Ready to Discover Amazing Books?',
      subtitle: 'Search for your favorite titles, authors, or explore by topics',
      action: 'Start Your Book Journey'
    },
    noResults: {
      icon: '🔍',
      title: 'No Books Found',
      subtitle: `No results found for "${searchTerm}"`,
      action: 'Try Different Keywords'
    },
    error: {
      icon: '⚠️',
      title: 'Something Went Wrong',
      subtitle: 'We encountered an issue while searching',
      action: 'Try Again'
    },
    filtered: {
      icon: '🎛️',
      title: 'No Books Match Your Filters',
      subtitle: 'Try adjusting your search filters',
      action: 'Clear Filters'
    }
  };

  const currentState = error ? states.error : 
                      searchTerm ? states.noResults : 
                      states.initial;


  const popularSearches = [
    {
      category: 'Programming',
      icon: '💻',
      searches: ['Python Programming', 'JavaScript', 'React Development', 'Clean Code']
    },
    {
      category: 'Science',
      icon: '🧪',
      searches: ['Machine Learning', 'Data Science', 'Physics', 'Chemistry']
    },
    {
      category: 'Literature',
      icon: '📖',
      searches: ['Classic Literature', 'Modern Fiction', 'Poetry', 'Drama']
    },
    {
      category: 'Business',
      icon: '💼',
      searches: ['Entrepreneurship', 'Marketing', 'Economics', 'Leadership']
    }
  ];

  // Search tips
  const searchTips = [
    {
      icon: '🎯',
      title: 'Be Specific',
      description: 'Use specific terms like "React.js tutorial" instead of just "programming"'
    },
    {
      icon: '👤',
      title: 'Try Author Names',
      description: 'Search by author names like "Robert Martin" or "Douglas Crockford"'
    },
    {
      icon: '🏷️',
      title: 'Use Subjects',
      description: 'Browse by subjects like "Computer Science" or "Mathematics"'
    },
    {
      icon: '🔢',
      title: 'ISBN Search',
      description: 'Have an ISBN? Paste it for exact book matches'
    }
  ];

 
  const trendingTopics = [
    { topic: 'Artificial Intelligence', count: '2.3k books', trend: '+15%' },
    { topic: 'Web Development', count: '1.8k books', trend: '+23%' },
    { topic: 'Data Analysis', count: '1.5k books', trend: '+18%' },
    { topic: 'Digital Marketing', count: '987 books', trend: '+12%' }
  ];

  const handleQuickSearch = (term) => {
    setSearchTerm(term);
    searchBooks(term, 'title');
  };

  const handleCategorySearch = (category) => {
    setSearchTerm(category);
    searchBooks(category, 'subject');
  };

  return (
    <div className="empty-state">

      <div className="empty-state-main">
        <div className="empty-icon">{currentState.icon}</div>
        
        <h2 className="empty-title">{currentState.title}</h2>
        
        <p className="empty-subtitle">{currentState.subtitle}</p>

        {error && (
          <div className="error-details">
            <p className="error-message">{error}</p>
            <button 
              className="retry-btn"
              onClick={() => searchBooks(searchTerm)}
            >
              🔄 Retry Search
            </button>
          </div>
        )}


        {searchTerm && !error && (
          <div className="no-results-help">
            <h3>💡 Search Suggestions:</h3>
            <ul className="search-suggestions">
              <li>Check your spelling</li>
              <li>Try more general terms</li>
              <li>Use fewer keywords</li>
              <li>Try searching by author instead</li>
            </ul>
          </div>
        )}
      </div>


      {!searchTerm && !error && (
        <div className="popular-searches-section">
          <h3 className="section-title">🔥 Popular Categories</h3>
          
          <div className="search-categories">
            {popularSearches.map((category, index) => (
              <div key={index} className="search-category">
                <h4 className="category-title">
                  <span className="category-icon">{category.icon}</span>
                  {category.category}
                </h4>
                <div className="category-searches">
                  {category.searches.map((search, searchIndex) => (
                    <button
                      key={searchIndex}
                      className="quick-search-btn"
                      onClick={() => handleQuickSearch(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searchTerm && !error && (
        <div className="trending-section">
          <h3 className="section-title">📈 Trending Now</h3>
          
          <div className="trending-topics">
            {trendingTopics.map((item, index) => (
              <div 
                key={index} 
                className="trending-item"
                onClick={() => handleCategorySearch(item.topic)}
              >
                <div className="trending-info">
                  <span className="trending-topic">{item.topic}</span>
                  <span className="trending-count">{item.count}</span>
                </div>
                <div className="trending-trend positive">
                  📈 {item.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      <div className="tips-section">
        <div className="tips-header">
          <h3 className="section-title">💡 Search Tips</h3>
          <button 
            className="toggle-tips-btn"
            onClick={() => setShowTips(!showTips)}
          >
            {showTips ? 'Hide Tips' : 'Show Tips'}
          </button>
        </div>

        {showTips && (
          <div className="search-tips-grid">
            {searchTips.map((tip, index) => (
              <div key={index} className="tip-card">
                <div className="tip-icon">{tip.icon}</div>
                <h4 className="tip-title">{tip.title}</h4>
                <p className="tip-description">{tip.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>


      {!searchTerm && !error && (
        <div className="student-resources">
          <h3 className="section-title">🎓 For College Students</h3>
          
          <div className="resource-categories">
            <div className="resource-category">
              <h4>📚 Academic Subjects</h4>
              <div className="resource-links">
                <button onClick={() => handleCategorySearch('Computer Science')}>
                  Computer Science
                </button>
                <button onClick={() => handleCategorySearch('Mathematics')}>
                  Mathematics
                </button>
                <button onClick={() => handleCategorySearch('Engineering')}>
                  Engineering
                </button>
                <button onClick={() => handleCategorySearch('Physics')}>
                  Physics
                </button>
              </div>
            </div>

            <div className="resource-category">
              <h4>💼 Career Development</h4>
              <div className="resource-links">
                <button onClick={() => handleQuickSearch('Software Engineering')}>
                  Software Engineering
                </button>
                <button onClick={() => handleQuickSearch('Project Management')}>
                  Project Management
                </button>
                <button onClick={() => handleQuickSearch('Interview Preparation')}>
                  Interview Prep
                </button>
                <button onClick={() => handleQuickSearch('Resume Writing')}>
                  Resume Writing
                </button>
              </div>
            </div>

            <div className="resource-category">
              <h4>🧠 Skill Building</h4>
              <div className="resource-links">
                <button onClick={() => handleQuickSearch('Critical Thinking')}>
                  Critical Thinking
                </button>
                <button onClick={() => handleQuickSearch('Problem Solving')}>
                  Problem Solving
                </button>
                <button onClick={() => handleQuickSearch('Communication Skills')}>
                  Communication
                </button>
                <button onClick={() => handleQuickSearch('Time Management')}>
                  Time Management
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="fun-facts">
        <h3 className="section-title">🤔 Did You Know?</h3>
        
        <div className="facts-carousel">
          <div className="fact-item active">
            <span className="fact-icon">📊</span>
            <p>Our library contains over 20 million books from around the world</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h3>Ready to Start Reading?</h3>
        <p>Begin your literary journey with just one search</p>
        
        <div className="cta-buttons">
          <button 
            className="cta-btn primary"
            onClick={() => handleQuickSearch('bestsellers')}
          >
            🏆 Browse Bestsellers
          </button>
          
          <button 
            className="cta-btn secondary"
            onClick={() => handleQuickSearch('new releases')}
          >
            🆕 New Releases
          </button>
          
          <button 
            className="cta-btn secondary"
            onClick={() => handleQuickSearch('free books')}
          >
            🆓 Free Books
          </button>
        </div>
      </div>

     
      <div className="empty-footer">
        <p>
          <strong>BookFinder Pro</strong> - Your gateway to knowledge and entertainment
        </p>
        <p>
          Built with ❤️ for students, researchers, and book lovers everywhere
        </p>
      </div>
    </div>
  );
};

export default EmptyState;