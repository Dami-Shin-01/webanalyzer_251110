import React from 'react';
import './WarningDisplay.css';

/**
 * WarningDisplay Component
 * Displays non-critical warnings (e.g., CORS issues, partial failures)
 */
const WarningDisplay = ({ warnings, onDismiss }) => {
  if (!warnings || warnings.length === 0) return null;

  const getWarningIcon = (type) => {
    switch (type) {
      case 'cors':
        return '🚫';
      case 'partial_failure':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="warning-display">
      {warnings.map((warning, index) => (
        <div key={index} className="warning-display__item">
          <div className="warning-display__content">
            <span className="warning-display__icon">
              {getWarningIcon(warning.type)}
            </span>
            <div className="warning-display__text">
              <p className="warning-display__message">{warning.message}</p>
              {warning.details && (
                <p className="warning-display__details">{warning.details}</p>
              )}
            </div>
          </div>
          {onDismiss && (
            <button
              className="warning-display__dismiss"
              onClick={() => onDismiss(index)}
              aria-label="경고 닫기"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default WarningDisplay;
