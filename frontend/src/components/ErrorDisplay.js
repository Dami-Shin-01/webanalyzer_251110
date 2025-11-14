import React from 'react';
import './ErrorDisplay.css';

/**
 * ErrorDisplay Component
 * Displays user-friendly error messages with contextual information
 * and recovery suggestions
 */
const ErrorDisplay = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  // Parse error object
  const errorType = error.type || 'unknown';
  const errorMessage = error.message || '예상치 못한 오류가 발생했습니다.';
  const errorDetails = error.details;
  const isRecoverable = error.recoverable !== false;

  // Get icon based on error type
  const getErrorIcon = () => {
    switch (errorType) {
      case 'network':
      case 'timeout':
        return '🌐';
      case 'not_found':
        return '🔍';
      case 'cors':
        return '🚫';
      case 'validation':
        return '⚠️';
      case 'parsing':
        return '📄';
      default:
        return '❌';
    }
  };

  // Get recovery suggestions based on error type
  const getRecoverySuggestions = () => {
    switch (errorType) {
      case 'network':
        return [
          '인터넷 연결을 확인해주세요',
          'VPN을 사용 중이라면 비활성화해보세요',
          '잠시 후 다시 시도해주세요'
        ];
      case 'timeout':
        return [
          '웹사이트가 응답하는지 확인해주세요',
          '더 빠른 웹사이트로 시도해보세요',
          '잠시 후 다시 시도해주세요'
        ];
      case 'not_found':
        return [
          'URL이 올바른지 확인해주세요',
          'http:// 또는 https://를 포함했는지 확인해주세요',
          '웹사이트가 현재 운영 중인지 확인해주세요'
        ];
      case 'cors':
        return [
          '일부 웹사이트는 보안 정책으로 인해 분석이 제한될 수 있습니다',
          '다른 웹사이트로 시도해보세요',
          '브라우저 확장 프로그램을 비활성화해보세요'
        ];
      case 'validation':
        return [
          'URL 형식을 확인해주세요',
          'HTTP 또는 HTTPS 프로토콜을 사용해주세요'
        ];
      case 'parsing':
        return [
          'CSS 파일이 손상되었을 수 있습니다',
          '다른 웹사이트로 시도해보세요'
        ];
      default:
        return [
          '페이지를 새로고침해보세요',
          '잠시 후 다시 시도해주세요'
        ];
    }
  };

  const suggestions = getRecoverySuggestions();

  return (
    <div className="error-display">
      <div className="error-display__container">
        <div className="error-display__header">
          <span className="error-display__icon">{getErrorIcon()}</span>
          <h3 className="error-display__title">오류 발생</h3>
        </div>

        <div className="error-display__content">
          <p className="error-display__message">{errorMessage}</p>

          {errorDetails && process.env.NODE_ENV === 'development' && (
            <details className="error-display__details">
              <summary>기술적 세부사항</summary>
              <pre className="error-display__details-content">{errorDetails}</pre>
            </details>
          )}

          {suggestions.length > 0 && (
            <div className="error-display__suggestions">
              <h4 className="error-display__suggestions-title">해결 방법:</h4>
              <ul className="error-display__suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="error-display__actions">
          {isRecoverable && onRetry && (
            <button
              className="error-display__button error-display__button--primary"
              onClick={onRetry}
            >
              다시 시도
            </button>
          )}
          {onDismiss && (
            <button
              className="error-display__button error-display__button--secondary"
              onClick={onDismiss}
            >
              닫기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
