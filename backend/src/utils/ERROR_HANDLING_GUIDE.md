# Error Handling Guide

## Overview

The Project Snapshot application implements a comprehensive error handling system that provides:

- **Centralized error management** through the `ErrorHandler` class
- **Consistent error formatting** across all API responses
- **User-friendly error messages** in Korean
- **Detailed logging** for debugging
- **Error categorization** for appropriate handling
- **Recovery suggestions** for recoverable errors

## Architecture

### Backend Components

#### 1. ErrorHandler Class (`src/utils/ErrorHandler.js`)

The central error handling utility that provides:

- Error categorization
- Error formatting
- User message generation
- Logging
- HTTP status code mapping

#### 2. Route Error Handling (`src/routes/analysis.js`)

Uses `ErrorHandler.asyncHandler()` to wrap async route handlers and automatically catch and format errors.

#### 3. Global Error Middleware (`src/server.js`)

Catches any unhandled errors and formats them using ErrorHandler.

### Frontend Components

#### 1. ErrorDisplay Component (`src/components/ErrorDisplay.js`)

Displays critical errors with:
- Error icon based on type
- User-friendly message
- Recovery suggestions
- Retry button (for recoverable errors)
- Technical details (in development mode)

#### 2. WarningDisplay Component (`src/components/WarningDisplay.js`)

Displays non-critical warnings such as:
- CORS issues
- Partial CSS file download failures
- Other recoverable issues

#### 3. Enhanced API Service (`src/services/api.js`)

Parses backend error responses and formats them for frontend consumption.

## Error Types

The system recognizes the following error types:

| Type | Description | HTTP Status | Recoverable |
|------|-------------|-------------|-------------|
| `network` | Network connectivity issues | 502 | Yes |
| `timeout` | Request timeout | 504 | Yes |
| `http` | HTTP errors (4xx, 5xx) | 502 | No |
| `not_found` | Domain/resource not found | 404 | No |
| `cors` | CORS policy restrictions | 502 | Yes |
| `parsing` | CSS parsing errors | 422 | No |
| `validation` | Input validation errors | 400 | No |
| `server` | Internal server errors | 500 | No |
| `unknown` | Unrecognized errors | 500 | No |

## Usage Examples

### Backend: Creating Custom Errors

```javascript
const ErrorHandler = require('../utils/ErrorHandler');

// Create a validation error
throw ErrorHandler.createError(
  'URL이 필요합니다.',
  ErrorHandler.ErrorTypes.VALIDATION,
  { field: 'url' }
);

// Create a network error
throw ErrorHandler.createError(
  '웹사이트에 연결할 수 없습니다.',
  ErrorHandler.ErrorTypes.NETWORK,
  { url: targetUrl }
);
```

### Backend: Using asyncHandler

```javascript
const ErrorHandler = require('../utils/ErrorHandler');

router.post('/analyze', ErrorHandler.asyncHandler(async (req, res) => {
  // Your async code here
  // Any thrown errors will be automatically caught and formatted
  const result = await analyzer.analyze(url);
  res.json({ success: true, data: result });
}));
```

### Backend: Manual Error Handling

```javascript
try {
  const result = await someOperation();
} catch (error) {
  const errorResponse = ErrorHandler.handle(error, 'operation-context');
  const statusCode = ErrorHandler.getStatusCode(errorResponse.type);
  
  res.status(statusCode).json({
    success: false,
    error: errorResponse
  });
}
```

### Frontend: Displaying Errors

```javascript
import ErrorDisplay from './components/ErrorDisplay';

function MyComponent() {
  const [error, setError] = useState(null);

  const handleRetry = () => {
    // Retry logic
  };

  return (
    <ErrorDisplay 
      error={error}
      onRetry={handleRetry}
      onDismiss={() => setError(null)}
    />
  );
}
```

### Frontend: Displaying Warnings

```javascript
import WarningDisplay from './components/WarningDisplay';

function MyComponent() {
  const [warnings, setWarnings] = useState([]);

  const handleDismissWarning = (index) => {
    setWarnings(warnings.filter((_, i) => i !== index));
  };

  return (
    <WarningDisplay 
      warnings={warnings}
      onDismiss={handleDismissWarning}
    />
  );
}
```

## Error Response Format

### Backend Response

```json
{
  "success": false,
  "error": {
    "type": "network",
    "message": "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
    "details": "ECONNREFUSED (development only)",
    "context": "/api/analyze",
    "recoverable": true,
    "timestamp": "2025-11-13T10:00:00.000Z",
    "statusCode": 502,
    "url": "https://example.com"
  }
}
```

### Warning Format

```json
{
  "success": true,
  "data": {
    "tokens": { ... },
    "metadata": {
      "warnings": [
        {
          "type": "cors",
          "message": "Some CSS files could not be downloaded due to CORS restrictions.",
          "details": "This may result in incomplete design token extraction.",
          "recoverable": true
        }
      ]
    }
  }
}
```

## Logging

### Log Format

```
[TIMESTAMP] [ERROR_TYPE] [CONTEXT] Error message
```

Example:
```
[2025-11-13T10:00:00.000Z] [NETWORK] [/api/analyze] Connection refused
```

### Log Levels

- **ERROR**: Critical errors (network, server, unknown)
- **WARN**: Recoverable issues (CORS, timeout)

### Development vs Production

- **Development**: Full error details, stack traces, and technical information
- **Production**: User-friendly messages only, no sensitive information

## Best Practices

### 1. Always Use ErrorHandler for Consistency

```javascript
// Good
throw ErrorHandler.createError('Invalid URL', ErrorHandler.ErrorTypes.VALIDATION);

// Avoid
throw new Error('Invalid URL');
```

### 2. Provide Context

```javascript
const errorResponse = ErrorHandler.handle(error, 'css-parsing');
```

### 3. Use asyncHandler for Routes

```javascript
// Good
router.post('/analyze', ErrorHandler.asyncHandler(async (req, res) => {
  // ...
}));

// Avoid manual try-catch in every route
```

### 4. Include Recovery Suggestions

Frontend components automatically provide recovery suggestions based on error type.

### 5. Log Appropriately

The ErrorHandler automatically logs errors with appropriate levels. No need for manual logging in most cases.

## Testing

### Unit Tests

```javascript
const ErrorHandler = require('../utils/ErrorHandler');

describe('ErrorHandler', () => {
  it('should categorize network errors', () => {
    const error = new Error('Network error');
    error.code = 'ECONNREFUSED';
    
    const type = ErrorHandler.categorizeError(error);
    expect(type).toBe(ErrorHandler.ErrorTypes.NOT_FOUND);
  });
});
```

### Integration Tests

Test error handling in actual API calls:

```javascript
it('should return proper error for invalid URL', async () => {
  const response = await request(app)
    .post('/api/analyze')
    .send({ url: 'invalid-url' });
    
  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
  expect(response.body.error.type).toBe('validation');
});
```

## Troubleshooting

### Error Not Being Caught

- Ensure you're using `ErrorHandler.asyncHandler()` for async routes
- Check that global error middleware is registered last in server.js

### Wrong Error Type

- Verify error categorization logic in `ErrorHandler.categorizeError()`
- Check if error has the correct properties (code, response, etc.)

### Missing Error Details in Production

- This is intentional for security
- Set `NODE_ENV=development` to see full details

### Frontend Not Displaying Errors

- Check that error object has the correct structure
- Verify ErrorDisplay component is rendered
- Check browser console for React errors

## Future Enhancements

- [ ] Error tracking integration (Sentry, LogRocket)
- [ ] Error analytics and reporting
- [ ] Internationalization (i18n) for error messages
- [ ] Custom error pages for different error types
- [ ] Rate limiting error responses
- [ ] Error recovery workflows
