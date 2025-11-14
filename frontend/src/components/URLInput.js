import React, { useState } from 'react';
import './URLInput.css';
import { validateURL } from '../utils/urlValidator';

function URLInput({ onAnalyze, isDisabled }) {
  const [url, setUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate URL
    const validation = validateURL(url);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    // Clear validation error
    setValidationError('');

    // Call the analyze function
    await onAnalyze(url);
  };

  const handleInputChange = (e) => {
    setUrl(e.target.value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const handleKeyDown = (e) => {
    // Allow Escape key to clear input
    if (e.key === 'Escape') {
      setUrl('');
      setValidationError('');
    }
  };

  return (
    <div className="url-input-container">
      <form onSubmit={handleSubmit} className="url-input-form">
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            className={`url-input ${validationError ? 'error' : ''}`}
            disabled={isDisabled}
            aria-label="웹사이트 URL 입력"
            aria-invalid={!!validationError}
            aria-describedby={validationError ? 'url-error' : undefined}
            autoComplete="url"
          />
          <button
            type="submit"
            className="analyze-button"
            disabled={isDisabled || !url.trim()}
            aria-label={isDisabled ? '분석 진행 중' : '웹사이트 분석 시작'}
          >
            {isDisabled ? '분석 중...' : '분석 시작'}
          </button>
        </div>
        {validationError && (
          <div 
            id="url-error"
            className="validation-error" 
            role="alert"
            aria-live="polite"
          >
            <span aria-hidden="true">⚠️</span>
            <span>{validationError}</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default URLInput;
