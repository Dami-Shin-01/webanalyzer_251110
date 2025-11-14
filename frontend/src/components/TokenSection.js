import React, { useState, useRef, useEffect } from 'react';
import './TokenSection.css';
import { generateAutoName } from '../utils/starterKitBuilder';

function TokenSection({ title, icon, category, tokens, mappings, onMap, renderToken, getTokenKey }) {
  const [previewToken, setPreviewToken] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, tokens.length);
  }, [tokens.length]);

  const handleInputChange = (tokenKey, value) => {
    onMap(tokenKey, value);
    
    // Show preview
    if (value.trim()) {
      setPreviewToken({ key: tokenKey, name: value });
      
      // Clear preview after 2 seconds
      setTimeout(() => {
        setPreviewToken(null);
      }, 2000);
    }
  };

  const handleKeyDown = (e, index) => {
    // Arrow key navigation
    if (e.key === 'ArrowDown' && index < tokens.length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <section 
      className="token-section"
      aria-labelledby={`${title.replace(/\s+/g, '-')}-heading`}
    >
      <div className="token-section-header">
        <h3 id={`${title.replace(/\s+/g, '-')}-heading`}>
          <span className="section-icon" aria-hidden="true">{icon}</span>
          {title}
        </h3>
        <span className="token-count" aria-label={`${tokens.length}개의 토큰`}>
          {tokens.length}개
        </span>
      </div>

      <div className="token-list" role="list">
        {tokens.map((token, index) => {
          const tokenKey = getTokenKey(token);
          const mappedName = mappings[tokenKey] || '';

          return (
            <div 
              key={`${tokenKey}-${index}`} 
              className="token-item"
              role="listitem"
            >
              <div className="token-main">
                <div className="token-display">
                  {renderToken(token)}
                </div>
                
                <div className="token-input-group">
                  <label htmlFor={`token-input-${tokenKey}-${index}`} className="visually-hidden">
                    {title} 토큰 이름 입력
                  </label>
                  <input
                    id={`token-input-${tokenKey}-${index}`}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    value={mappedName}
                    onChange={(e) => handleInputChange(tokenKey, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder={category ? `자동: ${generateAutoName(category, tokenKey)}` : "토큰 이름 입력"}
                    className="token-name-input"
                    aria-label={`${title} 토큰 이름`}
                    aria-describedby={mappedName ? `preview-${tokenKey}-${index}` : undefined}
                  />
                  
                  {mappedName && (
                    <div 
                      id={`preview-${tokenKey}-${index}`}
                      className="token-preview-badge"
                      role="status"
                      aria-live="polite"
                    >
                      <span className="preview-label">미리보기:</span>
                      <code className="preview-name">{mappedName}</code>
                    </div>
                  )}
                </div>
              </div>

              {previewToken && previewToken.key === tokenKey && (
                <div 
                  className="token-live-preview"
                  role="status"
                  aria-live="polite"
                >
                  <span className="preview-icon" aria-hidden="true">✨</span>
                  <span>토큰 이름이 설정되었습니다: <strong>{previewToken.name}</strong></span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TokenSection;
