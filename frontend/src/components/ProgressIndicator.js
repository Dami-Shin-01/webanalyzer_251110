import React from 'react';
import './ProgressIndicator.css';

const ProgressIndicator = ({ currentStep, details, isVisible }) => {
  if (!isVisible) return null;

  const steps = [
    { id: 'fetching', label: 'HTML 다운로드', icon: '📥' },
    { id: 'parsing', label: 'CSS 파싱', icon: '🔍' },
    { id: 'extracting', label: '토큰 추출', icon: '🎨' },
    { id: 'analyzing', label: '분석 중', icon: '⚙️' },
    { id: 'completing', label: '완료 중', icon: '✨' }
  ];

  const getCurrentStepIndex = () => {
    const index = steps.findIndex(step => step.id === currentStep);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="progress-indicator">
      <div className="progress-header">
        <div className="spinner"></div>
        <h3>웹사이트 분석 중...</h3>
      </div>

      <div className="progress-steps">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`progress-step ${
              index < currentStepIndex
                ? 'completed'
                : index === currentStepIndex
                ? 'active'
                : 'pending'
            }`}
          >
            <div className="step-icon">{step.icon}</div>
            <div className="step-label">{step.label}</div>
            {index < currentStepIndex && (
              <div className="step-check">✓</div>
            )}
          </div>
        ))}
      </div>

      {details && (
        <div className="progress-details">
          <p>{details}</p>
        </div>
      )}

      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{
            width: `${((currentStepIndex + 1) / steps.length) * 100}%`
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
