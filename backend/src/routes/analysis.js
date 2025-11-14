const express = require('express');
const router = express.Router();
const StaticAnalyzer = require('../analyzers/StaticAnalyzer');
const DynamicAnalyzer = require('../analyzers/DynamicAnalyzer');
const ErrorHandler = require('../utils/ErrorHandler');
const URLValidator = require('../utils/URLValidator');

// Initialize analyzers
const staticAnalyzer = new StaticAnalyzer({
  timeout: parseInt(process.env.TIMEOUT) || 30000
});

const dynamicAnalyzer = new DynamicAnalyzer({
  timeout: parseInt(process.env.TIMEOUT) || 30000
});

// Analysis endpoint - now uses real StaticAnalyzer with comprehensive error handling
router.post('/analyze', ErrorHandler.asyncHandler(async (req, res) => {
  const { url, options = {} } = req.body;

  // Sanitize URL input
  const sanitizedUrl = URLValidator.sanitize(url);

  // Comprehensive URL validation using URLValidator (Requirements 1.5, 9.4)
  const validationResult = URLValidator.validate(sanitizedUrl);
  
  if (!validationResult.valid) {
    throw ErrorHandler.createError(
      validationResult.error,
      ErrorHandler.ErrorTypes.VALIDATION,
      {
        field: 'url',
        type: validationResult.type,
        details: validationResult.details,
        hostname: validationResult.hostname,
        protocol: validationResult.protocol
      }
    );
  }

  // Use the validated and normalized URL
  const validatedUrl = validationResult.url;
  
  console.log(`Starting analysis for: ${validatedUrl}`);
  
  // Perform static analysis with validated URL
  const result = await staticAnalyzer.analyze(validatedUrl);
  
  console.log(`Static analysis completed in ${result.metadata.duration}ms`);
  
  // Perform dynamic analysis if requested
  if (options.includeDynamic) {
    try {
      console.log('Starting dynamic analysis...');
      const motionReports = await dynamicAnalyzer.analyze(validatedUrl);
      result.motionReports = motionReports;
      console.log('Dynamic analysis completed successfully');
    } catch (dynamicError) {
      // 동적 분석 실패 시 정적 분석 결과만 반환 (Requirement 8.2)
      console.error('Dynamic analysis failed:', dynamicError.message);
      result.metadata.warnings = result.metadata.warnings || [];
      result.metadata.warnings.push({
        type: 'dynamic_analysis_failed',
        message: '동적 분석을 수행할 수 없습니다.',
        details: dynamicError.message,
        recoverable: true
      });
      result.motionReports = [];
    }
  }
  
  console.log(`Analysis completed in ${result.metadata.duration}ms`);
  
  // Check for CORS issues and add warning if present
  if (result.metadata.hasCORSIssues) {
    result.metadata.warnings = result.metadata.warnings || [];
    result.metadata.warnings.push({
      type: 'cors',
      message: 'Some CSS files could not be downloaded due to CORS restrictions.',
      details: 'This may result in incomplete design token extraction.',
      recoverable: true
    });
  }
  
  // Add warnings for failed CSS files
  if (result.metadata.filesFailed > 0) {
    result.metadata.warnings = result.metadata.warnings || [];
    result.metadata.warnings.push({
      type: 'partial_failure',
      message: `${result.metadata.filesFailed} CSS file(s) could not be downloaded.`,
      details: `Successfully downloaded ${result.metadata.filesDownloaded} out of ${result.metadata.cssFilesFound} CSS files.`,
      recoverable: true
    });
  }
  
  res.json({
    success: true,
    data: result
  });
}));

module.exports = router;
