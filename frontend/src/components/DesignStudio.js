import React, { useState } from 'react';
import './DesignStudio.css';
import TokenSection from './TokenSection';
import ExportOptions from './ExportOptions';
import { generateAndDownloadZip } from '../utils/zipGenerator';

function DesignStudio({ tokens, metadata, motionReports = [], onClose }) {
  const [tokenMappings, setTokenMappings] = useState({
    colors: {},
    fonts: {},
    spacing: {},
    effects: {},
    animations: {}
  });

  const [includeUnnamed, setIncludeUnnamed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedMotionReport, setSelectedMotionReport] = useState(null);

  const handleTokenMap = (category, value, name) => {
    setTokenMappings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [value]: name
      }
    }));
  };

  const renderColorToken = (color) => {
    // Calculate if color is light or dark for better contrast
    const isLightColor = (hexColor) => {
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 155;
    };

    const isLight = color.startsWith('#') ? isLightColor(color) : false;

    return (
      <div className="token-preview color-preview">
        <div
          className="color-swatch"
          style={{ backgroundColor: color }}
          title={color}
          role="img"
          aria-label={`색상 ${color}`}
        >
          <span className={`color-check ${isLight ? 'dark' : 'light'}`}>✓</span>
        </div>
        <div className="color-info">
          <span className="token-value">{color}</span>
          <span className="color-label">{isLight ? '밝은 색상' : '어두운 색상'}</span>
        </div>
      </div>
    );
  };

  const renderFontToken = (font) => {
    return (
      <div className="token-preview font-preview">
        <div className="font-info">
          <div className="font-family">{font.family}</div>
          <div className="font-details">
            <span className="font-size">{font.size}</span>
            <span className="font-weight">Weight: {font.weight}</span>
            <span className="font-lineheight">Line: {font.lineHeight}</span>
          </div>
        </div>
      </div>
    );
  };

  const getFontKey = (font) => {
    return `${font.family}-${font.size}-${font.weight}-${font.lineHeight}`;
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Add motion report count to metadata
      const exportMetadata = {
        ...metadata,
        motionReportCount: motionReports.length
      };
      
      await generateAndDownloadZip(
        tokenMappings,
        tokens.animations || [],
        motionReports,
        exportMetadata,
        includeUnnamed
      );
    } catch (error) {
      console.error('Export failed:', error);
      alert('스타터 킷 생성 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="design-studio">
      <div className="design-studio-header">
        <h2>🎨 디자인 스튜디오</h2>
        <p>추출된 토큰에 의미 있는 이름을 부여하세요</p>
        <button className="close-button" onClick={onClose} aria-label="닫기">
          ✕
        </button>
      </div>

      <div className="design-studio-content">
        {tokens.colors && tokens.colors.length > 0 && (
          <TokenSection
            title="색상 토큰"
            icon="🎨"
            category="color"
            tokens={tokens.colors}
            mappings={tokenMappings.colors}
            onMap={(value, name) => handleTokenMap('colors', value, name)}
            renderToken={renderColorToken}
            getTokenKey={(color) => color}
          />
        )}

        {tokens.fonts && tokens.fonts.length > 0 && (
          <TokenSection
            title="타이포그래피 토큰"
            icon="📝"
            category="font"
            tokens={tokens.fonts}
            mappings={tokenMappings.fonts}
            onMap={(value, name) => handleTokenMap('fonts', value, name)}
            renderToken={renderFontToken}
            getTokenKey={getFontKey}
          />
        )}

        {tokens.spacing && tokens.spacing.length > 0 && (
          <TokenSection
            title="간격 토큰"
            icon="📏"
            category="spacing"
            tokens={tokens.spacing}
            mappings={tokenMappings.spacing}
            onMap={(value, name) => handleTokenMap('spacing', value, name)}
            renderToken={(spacing) => (
              <div className="token-preview spacing-preview">
                <span className="token-value">{spacing}</span>
              </div>
            )}
            getTokenKey={(spacing) => spacing}
          />
        )}

        {tokens.effects && tokens.effects.length > 0 && (
          <TokenSection
            title="효과 토큰"
            icon="✨"
            category="effect"
            tokens={tokens.effects}
            mappings={tokenMappings.effects}
            onMap={(value, name) => handleTokenMap('effects', value, name)}
            renderToken={(effect) => (
              <div className="token-preview effect-preview">
                <div className="effect-type">{effect.type}</div>
                <span className="token-value">{effect.value}</span>
              </div>
            )}
            getTokenKey={(effect) => `${effect.type}-${effect.value}`}
          />
        )}

        {tokens.animations && tokens.animations.length > 0 && (
          <TokenSection
            title="애니메이션 토큰"
            icon="🎬"
            tokens={tokens.animations}
            mappings={tokenMappings.animations}
            onMap={(value, name) => handleTokenMap('animations', value, name)}
            renderToken={(animation) => (
              <div className="token-preview animation-preview">
                <div className="animation-name">{animation.name}</div>
                {animation.duration && (
                  <span className="animation-duration">{animation.duration}</span>
                )}
              </div>
            )}
            getTokenKey={(animation) => animation.name}
          />
        )}

        {motionReports && motionReports.length > 0 && (
          <div className="motion-reports-section">
            <div className="section-header">
              <h3>
                <span className="section-icon">🎬</span>
                모션 리포트
              </h3>
              <p className="section-description">
                감지된 동적 애니메이션 ({motionReports.length}개)
              </p>
            </div>
            <div className="motion-reports-list">
              {motionReports.map((report, index) => (
                <div key={report.id || index} className="motion-report-card">
                  <div className="motion-report-header">
                    <h4>{report.id}</h4>
                    <button
                      className="preview-button"
                      onClick={() => setSelectedMotionReport(report)}
                    >
                      미리보기
                    </button>
                  </div>
                  <p className="motion-report-description">{report.description}</p>
                  <div className="motion-report-meta">
                    <span className="meta-item">
                      <strong>트리거:</strong> {report.trigger}
                    </span>
                    <span className="meta-item">
                      <strong>지속시간:</strong> {report.duration}ms
                    </span>
                    <span className="meta-item">
                      <strong>속성:</strong> {report.properties.map(p => p.property).join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="design-studio-footer">
        <div className="token-summary">
          <span>매핑된 토큰: {Object.values(tokenMappings).reduce((sum, category) => sum + Object.keys(category).length, 0)}개</span>
          {motionReports && motionReports.length > 0 && (
            <span> | 모션 리포트: {motionReports.length}개</span>
          )}
        </div>
      </div>

      <ExportOptions
        includeUnnamed={includeUnnamed}
        onToggleUnnamed={setIncludeUnnamed}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {selectedMotionReport && (
        <MotionReportPreview
          report={selectedMotionReport}
          onClose={() => setSelectedMotionReport(null)}
        />
      )}
    </div>
  );
}

/**
 * MotionReportPreview Component - Modal for previewing motion report details
 */
function MotionReportPreview({ report, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content motion-report-preview" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{report.id}</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <section className="preview-section">
            <h3>설명</h3>
            <p>{report.description}</p>
          </section>

          <section className="preview-section">
            <h3>애니메이션 정보</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>요소:</strong> <code>{report.element}</code>
              </div>
              <div className="info-item">
                <strong>트리거:</strong> {report.trigger}
              </div>
              <div className="info-item">
                <strong>지속 시간:</strong> {report.duration}ms
              </div>
              <div className="info-item">
                <strong>Easing:</strong> {report.easing}
              </div>
            </div>
          </section>

          <section className="preview-section">
            <h3>속성 변화</h3>
            <ul className="properties-list">
              {report.properties.map((prop, index) => (
                <li key={index}>
                  <strong>{prop.property}:</strong> <code>{prop.from}</code> → <code>{prop.to}</code>
                </li>
              ))}
            </ul>
          </section>

          <section className="preview-section">
            <h3>CSS 코드</h3>
            <pre className="code-block">
              <code>{report.codeSnippets.css}</code>
            </pre>
          </section>

          <section className="preview-section">
            <h3>JavaScript 코드 (Web Animation API)</h3>
            <pre className="code-block">
              <code>{report.codeSnippets.js}</code>
            </pre>
          </section>

          {report.codeSnippets.gsap && (
            <section className="preview-section">
              <h3>GSAP 코드 (선택적)</h3>
              <pre className="code-block">
                <code>{report.codeSnippets.gsap}</code>
              </pre>
            </section>
          )}
        </div>

        <div className="modal-footer">
          <button className="button secondary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default DesignStudio;
