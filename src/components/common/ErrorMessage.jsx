
import React, { useState, useEffect } from 'react';
import { useBooks } from '../../hooks/useBooks';
import './ErrorMessage.css';

const ErrorMessage = () => {
  const { error, clearError, searchBooks, searchTerm } = useBooks();
  const [isVisible, setIsVisible] = useState(false);
  const [errorType, setErrorType] = useState('generic');
  const [retryCount, setRetryCount] = useState(0);


  useEffect(() => {
    if (error) {
      setIsVisible(true);
      determineErrorType(error);
    } else {
      setIsVisible(false);
    }
  }, [error]);


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  
  const determineErrorType = (errorMessage) => {
    const message = errorMessage.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      setErrorType('network');
    } else if (message.includes('timeout')) {
      setErrorType('timeout');
    } else if (message.includes('not found') || message.includes('no books')) {
      setErrorType('notFound');
    } else if (message.includes('rate limit')) {
      setErrorType('rateLimit');
    } else if (message.includes('server') || message.includes('500')) {
      setErrorType('server');
    } else {
      setErrorType('generic');
    }
  };


  const errorConfigs = {
    network: {
      icon: '🌐',
      title: 'Connection Problem',
      description: 'Unable to connect to our book database. Please check your internet connection.',
      suggestions: [
        'Check your internet connection',
        'Try refreshing the page',
        'Disable any ad blockers temporarily'
      ],
      actions: ['retry', 'dismiss']
    },
    timeout: {
      icon: '⏱️',
      title: 'Request Timed Out',
      description: 'The search is taking longer than expected.',
      suggestions: [
        'Try a more specific search term',
        'Check your internet speed',
        'Try again in a few moments'
      ],
      actions: ['retry', 'dismiss']
    },
    notFound: {
      icon: '🔍',
      title: 'No Results Found',
      description: 'We couldn\'t find any books matching your search.',
      suggestions: [
        'Check spelling of your search terms',
        'Try broader or different keywords',
        'Use author names or book titles'
      ],
      actions: ['newSearch', 'dismiss']
    },
    rateLimit: {
      icon: '🚦',
      title: 'Too Many Requests',
      description: 'You\'ve made too many searches recently. Please wait a moment.',
      suggestions: [
        'Wait 30 seconds before searching again',
        'Try being more specific with searches',
        'Consider bookmarking interesting results'
      ],
      actions: ['wait', 'dismiss']
    },
    server: {
      icon: '🔧',
      title: 'Server Issue',
      description: 'Our book database is experiencing technical difficulties.',
      suggestions: [
        'This is temporary - try again in a few minutes',
        'The issue is on our end, not yours',
        'Check our status page for updates'
      ],
      actions: ['retry', 'dismiss']
    },
    generic: {
      icon: '⚠️',
      title: 'Something Went Wrong',
      description: 'An unexpected error occurred while searching for books.',
      suggestions: [
        'Try your search again',
        'Refresh the page if problem persists',
        'Contact support if error continues'
      ],
      actions: ['retry', 'dismiss']
    }
  };

  const currentConfig = errorConfigs[errorType];

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    clearError();
    
    if (searchTerm) {
      setTimeout(() => {
        searchBooks(searchTerm);
      }, 1000); 
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      clearError();
      setRetryCount(0);
    }, 300);
  };

  const handleNewSearch = () => {
    clearError();
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  };

  const handleWait = () => {
    setIsVisible(false);
    setTimeout(() => {
      clearError();
    }, 30000); 
  };

  if (!error || !isVisible) return null;

  return (
    <div className={`error-message ${isVisible ? 'visible' : ''} ${errorType}`}>
      <div className="error-container">
       
        <div className="error-header">
          <div className="error-icon">{currentConfig.icon}</div>
          <div className="error-title-section">
            <h3 className="error-title">{currentConfig.title}</h3>
            <p className="error-description">{currentConfig.description}</p>
          </div>
          <button 
            className="error-close"
            onClick={handleDismiss}
            title="Dismiss error"
          >
            ✕
          </button>
        </div>

        <div className="error-body">
        
          <details className="error-details">
            <summary>Technical Details</summary>
            <code className="error-code">{error}</code>
          </details>

         
          <div className="error-suggestions">
            <h4>💡 Try These Solutions:</h4>
            <ul className="suggestions-list">
              {currentConfig.suggestions.map((suggestion, index) => (
                <li key={index} className="suggestion-item">
                  <span className="suggestion-bullet">•</span>
                  <span className="suggestion-text">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>


          {retryCount > 0 && (
            <div className="retry-info">
              <p>
                {retryCount === 1 ? 'First' : retryCount === 2 ? 'Second' : `${retryCount}th`} retry attempt
              </p>
              {retryCount >= 3 && (
                <p className="retry-warning">
                  ⚠️ Multiple failures detected. There may be a temporary service issue.
                </p>
              )}
            </div>
          )}


          <div className="error-actions">
            {currentConfig.actions.includes('retry') && (
              <button 
                className="error-btn retry-btn"
                onClick={handleRetry}
                disabled={retryCount >= 5}
              >
                {retryCount >= 5 ? '⏸️ Too Many Retries' : '🔄 Try Again'}
              </button>
            )}

            {currentConfig.actions.includes('newSearch') && (
              <button 
                className="error-btn new-search-btn"
                onClick={handleNewSearch}
              >
                🔍 New Search
              </button>
            )}

            {currentConfig.actions.includes('wait') && (
              <button 
                className="error-btn wait-btn"
                onClick={handleWait}
              >
                ⏳ Wait & Retry
              </button>
            )}

            <button 
              className="error-btn dismiss-btn"
              onClick={handleDismiss}
            >
              ✅ Dismiss
            </button>
          </div>
        </div>

     
        <div className="error-footer">
          <div className="error-help">
            <span>Need more help? </span>
            <button className="help-link">
              📧 Contact Support
            </button>
          </div>
          
          <div className="error-status">
            <span className="status-indicator"></span>
            <span>Monitoring system status...</span>
          </div>
        </div>
      </div>

      
      <div className="auto-dismiss-progress">
        <div className="progress-fill"></div>
      </div>
    </div>
  );
};

export default ErrorMessage;