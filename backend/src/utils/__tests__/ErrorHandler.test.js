const ErrorHandler = require('../ErrorHandler');

describe('ErrorHandler', () => {
  describe('categorizeError', () => {
    it('should categorize network errors correctly', () => {
      const error = new Error('Network error');
      error.code = 'ECONNREFUSED';
      
      const type = ErrorHandler.categorizeError(error);
      expect(type).toBe(ErrorHandler.ErrorTypes.NOT_FOUND);
    });

    it('should categorize timeout errors correctly', () => {
      const error = new Error('Request timeout');
      error.code = 'ECONNABORTED';
      
      const type = ErrorHandler.categorizeError(error);
      expect(type).toBe(ErrorHandler.ErrorTypes.TIMEOUT);
    });

    it('should categorize HTTP errors correctly', () => {
      const error = new Error('HTTP error');
      error.response = { status: 404 };
      
      const type = ErrorHandler.categorizeError(error);
      expect(type).toBe(ErrorHandler.ErrorTypes.HTTP);
    });

    it('should categorize CORS errors correctly', () => {
      const error = new Error('CORS policy blocked');
      
      const type = ErrorHandler.categorizeError(error);
      expect(type).toBe(ErrorHandler.ErrorTypes.CORS);
    });

    it('should categorize parsing errors correctly', () => {
      const error = new Error('Failed to parse CSS');
      
      const type = ErrorHandler.categorizeError(error);
      expect(type).toBe(ErrorHandler.ErrorTypes.PARSING);
    });

    it('should return unknown for unrecognized errors', () => {
      const error = new Error('Some random error');
      
      const type = ErrorHandler.categorizeError(error);
      expect(type).toBe(ErrorHandler.ErrorTypes.UNKNOWN);
    });

    it('should use existing error type if present', () => {
      const error = new Error('Test error');
      error.type = ErrorHandler.ErrorTypes.VALIDATION;
      
      const type = ErrorHandler.categorizeError(error);
      expect(type).toBe(ErrorHandler.ErrorTypes.VALIDATION);
    });
  });

  describe('formatError', () => {
    it('should format error with all required fields', () => {
      const error = new Error('Test error');
      const formatted = ErrorHandler.formatError(
        error,
        ErrorHandler.ErrorTypes.NETWORK,
        'test-context'
      );

      expect(formatted).toHaveProperty('type', ErrorHandler.ErrorTypes.NETWORK);
      expect(formatted).toHaveProperty('message');
      expect(formatted).toHaveProperty('context', 'test-context');
      expect(formatted).toHaveProperty('recoverable');
      expect(formatted).toHaveProperty('timestamp');
    });

    it('should include HTTP status code if available', () => {
      const error = new Error('HTTP error');
      error.response = { status: 404 };
      
      const formatted = ErrorHandler.formatError(
        error,
        ErrorHandler.ErrorTypes.HTTP,
        'test'
      );

      expect(formatted.statusCode).toBe(404);
    });
  });

  describe('getUserMessage', () => {
    it('should return appropriate message for network errors', () => {
      const message = ErrorHandler.getUserMessage(
        ErrorHandler.ErrorTypes.NETWORK,
        new Error()
      );
      
      expect(message).toContain('네트워크');
    });

    it('should return appropriate message for timeout errors', () => {
      const message = ErrorHandler.getUserMessage(
        ErrorHandler.ErrorTypes.TIMEOUT,
        new Error()
      );
      
      expect(message).toContain('시간이 초과');
    });

    it('should return appropriate message for CORS errors', () => {
      const message = ErrorHandler.getUserMessage(
        ErrorHandler.ErrorTypes.CORS,
        new Error()
      );
      
      expect(message).toContain('CORS');
    });
  });

  describe('isRecoverable', () => {
    it('should mark timeout errors as recoverable', () => {
      const recoverable = ErrorHandler.isRecoverable(ErrorHandler.ErrorTypes.TIMEOUT);
      expect(recoverable).toBe(true);
    });

    it('should mark network errors as recoverable', () => {
      const recoverable = ErrorHandler.isRecoverable(ErrorHandler.ErrorTypes.NETWORK);
      expect(recoverable).toBe(true);
    });

    it('should mark CORS errors as recoverable', () => {
      const recoverable = ErrorHandler.isRecoverable(ErrorHandler.ErrorTypes.CORS);
      expect(recoverable).toBe(true);
    });

    it('should mark unknown errors as not recoverable', () => {
      const recoverable = ErrorHandler.isRecoverable(ErrorHandler.ErrorTypes.UNKNOWN);
      expect(recoverable).toBe(false);
    });
  });

  describe('isCORSError', () => {
    it('should detect CORS errors from message', () => {
      const error = new Error('CORS policy blocked this request');
      expect(ErrorHandler.isCORSError(error)).toBe(true);
    });

    it('should detect cross-origin errors', () => {
      const error = new Error('Cross-origin request blocked');
      expect(ErrorHandler.isCORSError(error)).toBe(true);
    });

    it('should not detect non-CORS errors', () => {
      const error = new Error('Regular network error');
      expect(ErrorHandler.isCORSError(error)).toBe(false);
    });
  });

  describe('createError', () => {
    it('should create error with type', () => {
      const error = ErrorHandler.createError(
        'Test message',
        ErrorHandler.ErrorTypes.VALIDATION
      );

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test message');
      expect(error.type).toBe(ErrorHandler.ErrorTypes.VALIDATION);
    });

    it('should include additional data', () => {
      const error = ErrorHandler.createError(
        'Test message',
        ErrorHandler.ErrorTypes.VALIDATION,
        { field: 'url', value: 'invalid' }
      );

      expect(error.field).toBe('url');
      expect(error.value).toBe('invalid');
    });
  });

  describe('getStatusCode', () => {
    it('should return 400 for validation errors', () => {
      const code = ErrorHandler.getStatusCode(ErrorHandler.ErrorTypes.VALIDATION);
      expect(code).toBe(400);
    });

    it('should return 404 for not found errors', () => {
      const code = ErrorHandler.getStatusCode(ErrorHandler.ErrorTypes.NOT_FOUND);
      expect(code).toBe(404);
    });

    it('should return 504 for timeout errors', () => {
      const code = ErrorHandler.getStatusCode(ErrorHandler.ErrorTypes.TIMEOUT);
      expect(code).toBe(504);
    });

    it('should return 502 for network errors', () => {
      const code = ErrorHandler.getStatusCode(ErrorHandler.ErrorTypes.NETWORK);
      expect(code).toBe(502);
    });

    it('should return 500 for unknown errors', () => {
      const code = ErrorHandler.getStatusCode(ErrorHandler.ErrorTypes.UNKNOWN);
      expect(code).toBe(500);
    });
  });

  describe('handle', () => {
    it('should handle and format error completely', () => {
      const error = new Error('Test error');
      error.code = 'ECONNREFUSED';
      
      const result = ErrorHandler.handle(error, 'test-context');

      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('context', 'test-context');
      expect(result).toHaveProperty('recoverable');
    });
  });
});
