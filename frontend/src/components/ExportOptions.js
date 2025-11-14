import React from 'react';
import './ExportOptions.css';

/**
 * ExportOptions Component
 * Allows users to configure export settings for the starter kit
 */
function ExportOptions({ includeUnnamed, onToggleUnnamed, onExport, isExporting }) {
  return (
    <div className="export-options">
      <div className="export-options-header">
        <h3>내보내기 옵션</h3>
      </div>

      <div className="export-options-content">
        <div className="option-group">
          <label className="option-label">
            <input
              type="checkbox"
              checked={includeUnnamed}
              onChange={(e) => onToggleUnnamed(e.target.checked)}
              disabled={isExporting}
            />
            <span className="option-text">
              <strong>이름 없는 토큰 포함</strong>
              <small>이름이 지정되지 않은 토큰을 자동 생성된 이름으로 포함합니다</small>
            </span>
          </label>
        </div>

        <div className="export-formats">
          <h4>포함될 형식</h4>
          <ul className="format-list">
            <li>✅ CSS Custom Properties (.css)</li>
            <li>✅ SCSS Variables (.scss)</li>
            <li>✅ JSON (.json)</li>
            <li>✅ README.md</li>
          </ul>
        </div>
      </div>

      <div className="export-options-footer">
        <button
          className="export-button primary"
          onClick={onExport}
          disabled={isExporting}
        >
          {isExporting ? '생성 중...' : '📦 스타터 킷 다운로드'}
        </button>
      </div>
    </div>
  );
}

export default ExportOptions;
