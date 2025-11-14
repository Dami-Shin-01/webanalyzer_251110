# Static Analyzer Implementation

## Overview

The `StaticAnalyzer` class is responsible for downloading and analyzing HTML and CSS files from target websites to extract design tokens. This implementation handles network errors gracefully and includes CORS detection.

## Architecture Validation Results

Tested with 10 real reference websites:
- ✅ **Success Rate: 80%** (8/10 websites)
- ✅ **No CORS Issues Detected**
- ⏱️ **Average Duration: 746ms**
- 📄 **Average CSS Files: 5.9 per site**

### Test Results Summary

| Website | Status | CSS Files | Notes |
|---------|--------|-----------|-------|
| example.com | ✅ Success | 0 | Simple HTML |
| wikipedia.org | ✅ Success | 0 | Redirect page |
| github.com | ✅ Success | 14 | Full analysis |
| stackoverflow.com | ❌ Failed | - | HTTP 403 (bot protection) |
| mozilla.org | ✅ Success | 5 | Full analysis |
| w3.org | ✅ Success | 3 | Full analysis |
| developer.mozilla.org | ✅ Success | 20 | Full analysis |
| npmjs.com | ❌ Failed | - | HTTP 403 (bot protection) |
| nodejs.org | ✅ Success | 5 | Full analysis |
| reactjs.org | ✅ Success | 0/1 | 404 on CSS file |

**Conclusion**: Server-side architecture is viable. The 20% failure rate is due to bot protection (403 errors), not CORS issues.

## Features

### ✅ Implemented

1. **HTML Download**
   - Axios-based HTTP client with proper headers
   - User-Agent spoofing to avoid bot detection
   - 30-second timeout (configurable)
   - Automatic redirect following (max 5)
   - Comprehensive error handling

2. **CSS Link Extraction**
   - Parses `<link rel="stylesheet">` tags
   - Resolves relative URLs to absolute URLs
   - Handles protocol-relative URLs (`//cdn.example.com/style.css`)
   - Extracts `@import` statements from inline `<style>` tags
   - Deduplicates CSS URLs

3. **CSS File Download**
   - Parallel download with `Promise.allSettled`
   - Graceful degradation (continues if some files fail)
   - Merges all CSS content with source comments
   - Tracks download success/failure statistics

4. **Error Handling**
   - Network errors (timeout, connection refused, not found)
   - HTTP errors (403, 404, 500, etc.)
   - CORS error detection
   - Detailed error categorization

5. **CORS Detection**
   - Identifies CORS-related errors
   - Tracks CORS issues per file
   - Provides warnings in response metadata
   - No blocking - continues with available data

## Usage

### Basic Usage

```javascript
const StaticAnalyzer = require('./analyzers/StaticAnalyzer');

const analyzer = new StaticAnalyzer({
  timeout: 30000  // 30 seconds
});

const result = await analyzer.analyze('https://example.com');

console.log(result.tokens);        // Extracted design tokens
console.log(result.metadata);      // Analysis metadata
```

### Response Structure

```javascript
{
  tokens: {
    colors: [],      // Will be populated in Task 7
    fonts: [],       // Will be populated in Task 8
    spacing: [],     // Will be populated in Task 9
    effects: [],     // Will be populated in Task 9
    animations: []   // Will be populated in Task 10
  },
  metadata: {
    analyzedUrl: 'https://example.com',
    timestamp: '2025-11-13T10:00:00.000Z',
    duration: 1234,
    cssFilesFound: 5,
    cssFilesDownloaded: 4,
    hasCORSIssues: false,
    warnings: []
  }
}
```

### Error Handling

```javascript
try {
  const result = await analyzer.analyze(url);
} catch (error) {
  console.error(`Error type: ${error.type}`);
  console.error(`Message: ${error.message}`);
  
  // Error types:
  // - 'timeout': Request took too long
  // - 'http': HTTP error (403, 404, etc.)
  // - 'not_found': Domain not found
  // - 'cors': CORS restriction
  // - 'network': General network error
}
```

## API Integration

The analyzer is integrated into the Express API at `/api/analyze`:

```javascript
POST /api/analyze
Content-Type: application/json

{
  "url": "https://example.com",
  "options": {
    "timeout": 30000
  }
}
```

Response:
```javascript
{
  "success": true,
  "data": {
    "tokens": { ... },
    "metadata": { ... }
  }
}
```

## Testing

Run the architecture validation test:

```bash
node src/analyzers/test-analyzer.js
```

This tests the analyzer against 10 real websites and provides:
- Success/failure statistics
- CORS issue detection
- Performance metrics
- Architecture validation conclusion

## Implementation Details

### URL Resolution

The analyzer handles three types of URLs:

1. **Absolute URLs**: `https://example.com/style.css`
2. **Protocol-relative URLs**: `//cdn.example.com/style.css`
3. **Relative URLs**: `/css/style.css`, `../style.css`

All are resolved to absolute URLs using the base page URL.

### Graceful Degradation

If CSS files fail to download:
- The analyzer continues with successfully downloaded files
- Failed files are logged with error details
- Partial results are still returned
- CORS issues are flagged but don't block analysis

### Performance

- Parallel CSS file downloads using `Promise.allSettled`
- 30-second timeout prevents hanging requests
- Average analysis time: ~750ms for typical websites
- Handles up to 20+ CSS files efficiently

## Next Steps

The following tasks will extend the `parseTokens()` method:

- **Task 7**: CSS color extraction (HEX, RGB, RGBA)
- **Task 8**: Typography extraction (font-family, size, weight, line-height)
- **Task 9**: Spacing and effects extraction (padding, margin, shadows)
- **Task 10**: Animation extraction (@keyframes)

## Known Limitations

1. **Bot Protection**: Some sites (Stack Overflow, npm) block automated requests with 403 errors
2. **Dynamic CSS**: JavaScript-injected styles are not captured (requires Task 12: Puppeteer)
3. **CSS-in-JS**: Inline styles and CSS-in-JS libraries are not extracted
4. **Authentication**: Cannot analyze pages behind login walls

## Configuration

Environment variables:

- `TIMEOUT`: Request timeout in milliseconds (default: 30000)
- `NODE_ENV`: Set to 'development' for detailed error messages

## Dependencies

- `axios`: HTTP client for downloading HTML/CSS
- `cheerio`: HTML parsing and CSS link extraction
- `url`: Node.js built-in URL resolution
