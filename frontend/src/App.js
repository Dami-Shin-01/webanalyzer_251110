import React, { useState, useEffect } from 'react';
import './App.css';
import URLInput from './components/URLInput';
import ProgressIndicator from './components/ProgressIndicator';
import DesignStudio from './components/DesignStudio';
import ErrorDisplay from './components/ErrorDisplay';
import WarningDisplay from './components/WarningDisplay';
import { analyzeWebsite } from './services/api';

// Debug: Log API URL on app load
console.log('🔧 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:5000');

/**
 * App Component - Main application container
 * 
 * Manages the overall application state and coordinates between:
 * - URL input and validation
 * - Analysis progress tracking
 * - Results display and token mapping
 * - Error and warning handling
 * 
 * State Flow:
 * 1. User enters URL → URLInput
 * 2. Analysis starts → ProgressIndicator shows
 * 3. Results received → DesignStudio displays
 * 4. User maps tokens → Export starter kit
 */
function App() {
  // Analysis state
  const [analysisResult, setAnalysisResult] = useState(null); // Extracted tokens and metadata
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Analysis in progress flag
  const [error, setError] = useState(null); // Error object if analysis fails
  const [warnings, setWarnings] = useState([]); // Non-critical warnings (e.g., CORS issues)
  
  // Progress tracking
  const [progressStep, setProgressStep] = useState('fetching'); // Current analysis step
  const [progressDetails, setProgressDetails] = useState(''); // Detailed progress message
  
  // User preferences
  const [lastUrl, setLastUrl] = useState(''); // Last analyzed URL for retry
  const [includeDynamic, setIncludeDynamic] = useState(false); // Enable Puppeteer analysis

  /**
   * Handle website analysis
   * 
   * Orchestrates the analysis process with progress updates:
   * 1. Fetching HTML from target URL
   * 2. Parsing CSS files
   * 3. Extracting design tokens
   * 4. Analyzing results
   * 5. Completing and displaying results
   * 
   * @param {string} url - Target website URL to analyze
   */
  const handleAnalyze = async (url) => {
    // Reset state for new analysis
    setIsAnalyzing(true);
    setError(null);
    setWarnings([]);
    setAnalysisResult(null);
    setLastUrl(url);

    try {
      // Step 1: Fetching HTML
      setProgressStep('fetching');
      setProgressDetails('서버에 연결 중... (첫 요청 시 30초~1분 소요될 수 있습니다)');
      
      // Simulate step progression for better UX (visual feedback)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProgressDetails(`${url}에서 HTML을 다운로드하고 있습니다...`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Parsing CSS
      setProgressStep('parsing');
      setProgressDetails('CSS 파일을 파싱하고 있습니다...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 3: Extracting tokens
      setProgressStep('extracting');
      setProgressDetails('디자인 토큰을 추출하고 있습니다...');
      
      // Make API call to backend
      const result = await analyzeWebsite(url, { includeDynamic });
      
      // Step 4: Analyzing
      setProgressStep('analyzing');
      setProgressDetails('추출된 데이터를 분석하고 있습니다...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 5: Completing
      setProgressStep('completing');
      setProgressDetails('분석을 완료하고 있습니다...');
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Handle successful analysis
      if (result.success) {
        setAnalysisResult(result.data);
        
        // Check for non-critical warnings (e.g., some CSS files failed to download)
        if (result.data.metadata?.warnings) {
          setWarnings(result.data.metadata.warnings);
        }
      } else {
        // Handle API-level errors
        setError(result.error || { message: '분석 중 오류가 발생했습니다.' });
      }
    } catch (err) {
      // Handle network or unexpected errors
      const errorObj = typeof err === 'string' 
        ? { message: err, type: 'unknown' }
        : { message: err.message || '분석 중 오류가 발생했습니다.', type: err.type || 'unknown' };
      
      setError(errorObj);
    } finally {
      // Reset progress state
      setIsAnalyzing(false);
      setProgressStep('fetching');
      setProgressDetails('');
    }
  };

  /**
   * Retry last failed analysis
   * Useful when analysis fails due to temporary network issues
   */
  const handleRetry = () => {
    if (lastUrl) {
      handleAnalyze(lastUrl);
    }
  };

  /**
   * Dismiss error message
   * Allows user to clear error and try a different URL
   */
  const handleDismissError = () => {
    setError(null);
  };

  /**
   * Dismiss a specific warning
   * Warnings are non-critical issues that don't prevent analysis
   * 
   * @param {number} index - Index of warning to dismiss
   */
  const handleDismissWarning = (index) => {
    setWarnings(warnings.filter((_, i) => i !== index));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📸 Project Snapshot</h1>
        <p>웹사이트 디자인 시스템 분석 도구</p>
      </header>
      
      <main className="App-main">
        <div className="container">
          <p className="welcome-text">
            레퍼런스 웹사이트의 URL을 입력하여 디자인 시스템을 분석하세요.
          </p>
          
          <URLInput onAnalyze={handleAnalyze} isDisabled={isAnalyzing} />

          <div className="analysis-options">
            <label className="option-label">
              <input
                type="checkbox"
                checked={includeDynamic}
                onChange={(e) => setIncludeDynamic(e.target.checked)}
                disabled={isAnalyzing}
              />
              <span className="option-text">
                동적 분석 포함 (JavaScript 애니메이션 감지)
              </span>
            </label>
          </div>

          <ErrorDisplay 
            error={error} 
            onRetry={handleRetry}
            onDismiss={handleDismissError}
          />

          <WarningDisplay 
            warnings={warnings}
            onDismiss={handleDismissWarning}
          />

          <ProgressIndicator
            currentStep={progressStep}
            details={progressDetails}
            isVisible={isAnalyzing}
          />

          {analysisResult && !isAnalyzing && (
            <DesignStudio
              tokens={analysisResult.tokens}
              metadata={analysisResult.metadata}
              motionReports={analysisResult.motionReports || []}
              onClose={() => setAnalysisResult(null)}
            />
          )}
        </div>
      </main>
      
      <footer className="App-footer">
        <p>Project Snapshot v1.0.0</p>
      </footer>
    </div>
  );
}

export default App;
