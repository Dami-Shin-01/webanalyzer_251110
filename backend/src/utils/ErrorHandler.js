/**
 * ErrorHandler - Centralized error handling and logging utility
 * Provides consistent error formatting, categorization, and logging
 */
class ErrorHandler {
  /**
   * Error types supported by the system
   */
  static ErrorTypes = {
    NETWORK: 'network',
    TIMEOUT: 'timeout',
    HTTP: 'http',
    NOT_FOUND: 'not_found',
    CORS: 'cors',
    PARSING: 'parsing',
    VALIDATION: 'validation',
    SERVER: 'server',
    UNKNOWN: 'unknown'
  };

  /**
   * Handle and format error for API response
   * @param {Error} error - Original error object
   * @param {string} context - Context where error occurred
   * @returns {Object} Formatted error response
   */
  static handle(error, context = 'unknown') {
    const errorType = this.categorizeError(error);
    const errorResponse = this.formatError(error, errorType, context);
    
    // Log error with context
    this.logError(error, errorType, context);
    
    return errorResponse;
  }

  /**
   * Categorize error based on error properties
   * @param {Error} error - Error object
   * @returns {string} Error type
   */
  static categorizeError(error) {
    // Check if error already has a type
    if (error.type && Object.values(this.ErrorTypes).includes(error.type)) {
      return error.type;
    }

    const message = error.message?.toLowerCase() || '';
    const code = error.code?.toLowerCase() || '';

    // Network errors
    if (code === 'econnrefused') {
      return this.ErrorTypes.NOT_FOUND;
    }
    if (code === 'enotfound') {
      return this.ErrorTypes.NOT_FOUND;
    }
    if (code === 'econnaborted' || message.includes('timeout')) {
      return this.ErrorTypes.TIMEOUT;
    }
    if (code.startsWith('enet') || message.includes('network')) {
      return this.ErrorTypes.NETWORK;
    }

    // HTTP errors
    if (error.response?.status || message.includes('http')) {
      return this.ErrorTypes.HTTP;
    }

    // CORS errors
    if (this.isCORSError(error)) {
      return this.ErrorTypes.CORS;
    }

    // Parsing errors
    if (message.includes('parse') || message.includes('invalid css')) {
      return this.ErrorTypes.PARSING;
    }

    // Validation errors
    if (message.includes('validation') || message.includes('invalid url')) {
      return this.ErrorTypes.VALIDATION;
    }

    return this.ErrorTypes.UNKNOWN;
  }

  /**
   * Format error into standardized response structure
   * @param {Error} error - Original error
   * @param {string} errorType - Categorized error type
   * @param {string} context - Error context
   * @returns {Object} Formatted error response
   */
  static formatError(error, errorType, context) {
    const userMessage = this.getUserMessage(errorType, error);
    const isRecoverable = this.isRecoverable(errorType);
    
    return {
      type: errorType,
      message: userMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      context,
      recoverable: isRecoverable,
      timestamp: new Date().toISOString(),
      // Include HTTP status if available
      statusCode: error.response?.status,
      // Include URL if available
      url: error.url || error.config?.url
    };
  }

  /**
   * Get user-friendly error message based on error type
   * @param {string} errorType - Error type
   * @param {Error} error - Original error
   * @returns {string} User-friendly message
   */
  static getUserMessage(errorType, error) {
    const messages = {
      [this.ErrorTypes.NETWORK]: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
      [this.ErrorTypes.TIMEOUT]: '요청 시간이 초과되었습니다. 웹사이트 응답이 너무 느립니다.',
      [this.ErrorTypes.HTTP]: `웹사이트에 접근할 수 없습니다.${error.response?.status ? ` (HTTP ${error.response.status})` : ''}`,
      [this.ErrorTypes.NOT_FOUND]: '웹사이트를 찾을 수 없습니다. URL을 확인해주세요.',
      [this.ErrorTypes.CORS]: 'CORS 정책으로 인해 일부 리소스를 가져올 수 없습니다. 분석 결과가 불완전할 수 있습니다.',
      [this.ErrorTypes.PARSING]: 'CSS 파일을 분석하는 중 오류가 발생했습니다.',
      [this.ErrorTypes.VALIDATION]: '입력값이 올바르지 않습니다. URL을 확인해주세요.',
      [this.ErrorTypes.SERVER]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      [this.ErrorTypes.UNKNOWN]: '예상치 못한 오류가 발생했습니다.'
    };

    return messages[errorType] || messages[this.ErrorTypes.UNKNOWN];
  }

  /**
   * Determine if error is recoverable
   * @param {string} errorType - Error type
   * @returns {boolean} True if recoverable
   */
  static isRecoverable(errorType) {
    const recoverableTypes = [
      this.ErrorTypes.TIMEOUT,
      this.ErrorTypes.NETWORK,
      this.ErrorTypes.CORS
    ];
    
    return recoverableTypes.includes(errorType);
  }

  /**
   * Check if error is CORS-related
   * @param {Error} error - Error object
   * @returns {boolean} True if CORS error
   */
  static isCORSError(error) {
    const message = error.message?.toLowerCase() || '';
    const corsIndicators = [
      'cors',
      'cross-origin',
      'access-control-allow-origin'
    ];
    
    return corsIndicators.some(indicator => message.includes(indicator));
  }

  /**
   * Log error with appropriate level and context
   * @param {Error} error - Error object
   * @param {string} errorType - Error type
   * @param {string} context - Error context
   */
  static logError(error, errorType, context) {
    const timestamp = new Date().toISOString();
    const logPrefix = `[${timestamp}] [${errorType.toUpperCase()}] [${context}]`;
    
    // Determine log level based on error type
    const isWarning = [
      this.ErrorTypes.CORS,
      this.ErrorTypes.TIMEOUT
    ].includes(errorType);

    if (isWarning) {
      console.warn(`${logPrefix} ${error.message}`);
    } else {
      console.error(`${logPrefix} ${error.message}`);
    }

    // Log stack trace in development
    if (process.env.NODE_ENV === 'development' && error.stack) {
      console.error('Stack trace:', error.stack);
    }

    // Log additional error details if available
    if (error.response) {
      console.error(`HTTP Status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
    
    if (error.config?.url) {
      console.error(`Request URL: ${error.config.url}`);
    }
  }

  /**
   * Create a custom error with type
   * @param {string} message - Error message
   * @param {string} type - Error type
   * @param {Object} additionalData - Additional error data
   * @returns {Error} Custom error
   */
  static createError(message, type = this.ErrorTypes.UNKNOWN, additionalData = {}) {
    const error = new Error(message);
    error.type = type;
    Object.assign(error, additionalData);
    return error;
  }

  /**
   * Wrap async route handler with error handling
   * @param {Function} handler - Async route handler
   * @returns {Function} Wrapped handler
   */
  static asyncHandler(handler) {
    return async (req, res, next) => {
      try {
        await handler(req, res, next);
      } catch (error) {
        const errorResponse = this.handle(error, req.path);
        const statusCode = this.getStatusCode(errorResponse.type);
        
        res.status(statusCode).json({
          success: false,
          error: errorResponse
        });
      }
    };
  }

  /**
   * Get HTTP status code for error type
   * @param {string} errorType - Error type
   * @returns {number} HTTP status code
   */
  static getStatusCode(errorType) {
    const statusCodes = {
      [this.ErrorTypes.VALIDATION]: 400,
      [this.ErrorTypes.NOT_FOUND]: 404,
      [this.ErrorTypes.TIMEOUT]: 504,
      [this.ErrorTypes.NETWORK]: 502,
      [this.ErrorTypes.HTTP]: 502,
      [this.ErrorTypes.CORS]: 502,
      [this.ErrorTypes.PARSING]: 422,
      [this.ErrorTypes.SERVER]: 500,
      [this.ErrorTypes.UNKNOWN]: 500
    };

    return statusCodes[errorType] || 500;
  }
}

module.exports = ErrorHandler;
