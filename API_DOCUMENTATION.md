# API Documentation - Project Snapshot

## Overview

Project Snapshot provides a RESTful API for analyzing websites and extracting design tokens. The API is built with Express.js and supports both static CSS analysis and dynamic motion observation.

## Base URL

**Development:**
```
http://localhost:5000
```

**Production:**
```
https://your-backend-domain.railway.app
```

## Authentication

Currently, the API does not require authentication. Rate limiting is applied to prevent abuse.

## Rate Limiting

- **Limit**: 10 requests per 15 minutes per IP address
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when the limit resets

**Rate Limit Exceeded Response:**
```json
{
  "error": "Too many requests, please try again later."
}
```

## Endpoints

### 1. Health Check

Check if the API server is running.

**Endpoint:** `GET /health`

**Request:**
```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-14T10:00:00.000Z"
}
```

**Status Codes:**
- `200 OK`: Server is healthy

---

### 2. Analyze Website

Analyze a website and extract design tokens and animations.

**Endpoint:** `POST /api/analyze`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://example.com",
  "options": {
    "includeDynamic": false,
    "timeout": 30000
  }
}
```

**Request Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `url` | string | Yes | - | The URL of the website to analyze. Must start with http:// or https:// |
| `options` | object | No | `{}` | Analysis options |
| `options.includeDynamic` | boolean | No | `false` | Enable dynamic analysis with Puppeteer |
| `options.timeout` | number | No | `30000` | Timeout in milliseconds (max 60000) |

**Success Response:**

```json
{
  "success": true,
  "data": {
    "tokens": {
      "colors": [
        "#FF0000",
        "#00FF00",
        "rgb(0, 0, 255)",
        "rgba(255, 255, 0, 0.5)"
      ],
      "fonts": [
        {
          "family": "Arial, sans-serif",
          "size": "16px",
          "weight": "400",
          "lineHeight": "1.5"
        },
        {
          "family": "Georgia, serif",
          "size": "24px",
          "weight": "700",
          "lineHeight": "1.2"
        }
      ],
      "spacing": [
        "8px",
        "16px",
        "24px",
        "32px",
        "1rem",
        "2rem"
      ],
      "effects": [
        {
          "type": "shadow",
          "value": "0 2px 4px rgba(0,0,0,0.1)"
        },
        {
          "type": "shadow",
          "value": "0 4px 8px rgba(0,0,0,0.2)"
        }
      ],
      "animations": [
        {
          "name": "fadeIn",
          "keyframes": "@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}",
          "duration": "300ms",
          "timingFunction": "ease-in-out"
        }
      ]
    },
    "motionReports": [
      {
        "id": "scroll-fade-1",
        "description": "Fade in animation triggered on scroll",
        "trigger": "scroll",
        "duration": 500,
        "properties": [
          {
            "property": "opacity",
            "from": "0",
            "to": "1"
          }
        ],
        "codeSnippets": {
          "css": "/* CSS implementation */\n.fade-in {\n  opacity: 0;\n  transition: opacity 0.5s ease;\n}\n.fade-in.visible {\n  opacity: 1;\n}",
          "js": "// JavaScript implementation\nconst observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      entry.target.classList.add('visible');\n    }\n  });\n});\n\ndocument.querySelectorAll('.fade-in').forEach(el => {\n  observer.observe(el);\n});",
          "gsap": "// GSAP implementation\ngsap.from('.fade-in', {\n  opacity: 0,\n  duration: 0.5,\n  scrollTrigger: {\n    trigger: '.fade-in',\n    start: 'top 80%'\n  }\n});"
        }
      }
    ],
    "metadata": {
      "analyzedUrl": "https://example.com",
      "timestamp": "2025-11-14T10:00:00.000Z",
      "duration": 5234,
      "cssFilesAnalyzed": 3,
      "dynamicAnalysisPerformed": false
    }
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "type": "validation",
    "message": "Invalid URL format",
    "details": "URL must start with http:// or https://"
  }
}
```

**Status Codes:**
- `200 OK`: Analysis completed successfully
- `400 Bad Request`: Invalid request parameters
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error during analysis

**Error Types:**

| Type | Description |
|------|-------------|
| `validation` | Invalid input parameters |
| `network` | Failed to fetch target website |
| `parsing` | Failed to parse CSS or HTML |
| `timeout` | Analysis exceeded timeout limit |
| `browser` | Puppeteer/browser error (dynamic analysis) |
| `unknown` | Unexpected error |

---

## Data Models

### Token Object

```typescript
interface ExtractedTokens {
  colors: string[];
  fonts: FontToken[];
  spacing: string[];
  effects: EffectToken[];
  animations: AnimationToken[];
}
```

### FontToken

```typescript
interface FontToken {
  family: string;      // e.g., "Arial, sans-serif"
  size: string;        // e.g., "16px", "1rem"
  weight: string;      // e.g., "400", "bold"
  lineHeight: string;  // e.g., "1.5", "24px"
}
```

### EffectToken

```typescript
interface EffectToken {
  type: 'shadow' | 'filter';
  value: string;  // e.g., "0 2px 4px rgba(0,0,0,0.1)"
}
```

### AnimationToken

```typescript
interface AnimationToken {
  name: string;           // e.g., "fadeIn"
  keyframes: string;      // Full @keyframes definition
  duration?: string;      // e.g., "300ms"
  timingFunction?: string; // e.g., "ease-in-out"
}
```

### MotionReport

```typescript
interface MotionReport {
  id: string;
  description: string;
  trigger: 'scroll' | 'hover' | 'load';
  duration: number;  // milliseconds
  properties: PropertyChange[];
  codeSnippets: {
    css: string;
    js: string;
    gsap?: string;
  };
}

interface PropertyChange {
  property: string;  // e.g., "opacity", "transform"
  from: string;
  to: string;
}
```

---

## Examples

### Example 1: Basic Static Analysis

**Request:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "colors": ["#FF0000", "#00FF00"],
      "fonts": [
        {
          "family": "Arial",
          "size": "16px",
          "weight": "400",
          "lineHeight": "1.5"
        }
      ],
      "spacing": ["8px", "16px"],
      "effects": [],
      "animations": []
    },
    "motionReports": [],
    "metadata": {
      "analyzedUrl": "https://example.com",
      "timestamp": "2025-11-14T10:00:00.000Z",
      "duration": 2500,
      "cssFilesAnalyzed": 2,
      "dynamicAnalysisPerformed": false
    }
  }
}
```

### Example 2: Analysis with Dynamic Motion Detection

**Request:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "options": {
      "includeDynamic": true,
      "timeout": 45000
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": { /* ... */ },
    "motionReports": [
      {
        "id": "scroll-fade-1",
        "description": "Fade in animation on scroll",
        "trigger": "scroll",
        "duration": 500,
        "properties": [
          {
            "property": "opacity",
            "from": "0",
            "to": "1"
          }
        ],
        "codeSnippets": {
          "css": "/* CSS code */",
          "js": "// JavaScript code",
          "gsap": "// GSAP code"
        }
      }
    ],
    "metadata": {
      "analyzedUrl": "https://example.com",
      "timestamp": "2025-11-14T10:00:00.000Z",
      "duration": 15234,
      "cssFilesAnalyzed": 3,
      "dynamicAnalysisPerformed": true
    }
  }
}
```

### Example 3: Error Handling

**Request with Invalid URL:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "not-a-valid-url"
  }'
```

**Response:**
```json
{
  "success": false,
  "error": {
    "type": "validation",
    "message": "Invalid URL format",
    "details": "URL must start with http:// or https://"
  }
}
```

---

## Client Integration

### JavaScript/Axios Example

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000';

async function analyzeWebsite(url, includeDynamic = false) {
  try {
    const response = await axios.post(`${API_URL}/api/analyze`, {
      url,
      options: {
        includeDynamic,
        timeout: 30000
      }
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error.message);
    }
  } catch (error) {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data.error);
    } else if (error.request) {
      // No response received
      console.error('Network Error:', error.message);
    } else {
      // Request setup error
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Usage
analyzeWebsite('https://example.com', false)
  .then(data => {
    console.log('Colors:', data.tokens.colors);
    console.log('Fonts:', data.tokens.fonts);
  })
  .catch(error => {
    console.error('Analysis failed:', error);
  });
```

### Python/Requests Example

```python
import requests

API_URL = 'http://localhost:5000'

def analyze_website(url, include_dynamic=False):
    try:
        response = requests.post(
            f'{API_URL}/api/analyze',
            json={
                'url': url,
                'options': {
                    'includeDynamic': include_dynamic,
                    'timeout': 30000
                }
            },
            headers={'Content-Type': 'application/json'}
        )
        
        response.raise_for_status()
        data = response.json()
        
        if data['success']:
            return data['data']
        else:
            raise Exception(data['error']['message'])
            
    except requests.exceptions.RequestException as e:
        print(f'API Error: {e}')
        raise

# Usage
try:
    result = analyze_website('https://example.com')
    print('Colors:', result['tokens']['colors'])
    print('Fonts:', result['tokens']['fonts'])
except Exception as e:
    print(f'Analysis failed: {e}')
```

---

## Best Practices

### 1. Error Handling

Always check the `success` field before processing data:

```javascript
if (response.data.success) {
  // Process data
  const tokens = response.data.data.tokens;
} else {
  // Handle error
  const error = response.data.error;
  console.error(`${error.type}: ${error.message}`);
}
```

### 2. Timeout Configuration

Adjust timeout based on target website complexity:

- Simple sites: 15-20 seconds
- Medium sites: 30 seconds (default)
- Complex sites: 45-60 seconds

### 3. Dynamic Analysis

Use dynamic analysis sparingly as it consumes more resources:

```javascript
// Only enable for sites with JavaScript animations
const includeDynamic = hasJavaScriptAnimations(url);
```

### 4. Rate Limiting

Implement client-side rate limiting to avoid hitting server limits:

```javascript
const rateLimiter = {
  requests: [],
  maxRequests: 10,
  windowMs: 15 * 60 * 1000,
  
  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return this.requests.length < this.maxRequests;
  },
  
  recordRequest() {
    this.requests.push(Date.now());
  }
};

if (rateLimiter.canMakeRequest()) {
  await analyzeWebsite(url);
  rateLimiter.recordRequest();
} else {
  console.error('Rate limit reached. Please wait.');
}
```

### 5. Caching Results

Cache analysis results to reduce API calls:

```javascript
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function analyzeWithCache(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await analyzeWebsite(url);
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}
```

---

## Security Considerations

### Input Validation

The API validates all inputs:

- URL format (must be http:// or https://)
- Protocol restrictions (no file://, ftp://, etc.)
- Private IP blocking (no localhost, 127.0.0.1, 192.168.x.x, etc.)
- Timeout limits (max 60 seconds)

### CORS Policy

The API enforces CORS with specific origin:

```javascript
// Only requests from configured frontend URL are allowed
Access-Control-Allow-Origin: https://your-frontend.vercel.app
```

### Rate Limiting

- 10 requests per 15 minutes per IP
- Prevents abuse and DoS attacks

### Security Headers

The API uses Helmet.js for security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS only)

---

## Troubleshooting

### Common Issues

**1. CORS Error**

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: Ensure `FRONTEND_URL` environment variable matches your frontend URL exactly.

**2. Rate Limit Exceeded**

```json
{
  "error": "Too many requests, please try again later."
}
```

**Solution**: Wait 15 minutes or implement client-side rate limiting.

**3. Timeout Error**

```json
{
  "success": false,
  "error": {
    "type": "timeout",
    "message": "Analysis timed out"
  }
}
```

**Solution**: Increase timeout in request options or try a simpler website.

**4. Network Error**

```json
{
  "success": false,
  "error": {
    "type": "network",
    "message": "Failed to fetch target website"
  }
}
```

**Solution**: Check if target website is accessible and allows external requests.

---

## Changelog

### Version 1.0.0 (Current)

- Initial release
- Static CSS analysis
- Dynamic motion detection
- Rate limiting
- Security headers
- Error handling

---

## Support

For issues, questions, or feature requests:

- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Documentation: [README.md](README.md)
- Deployment Guide: [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Last Updated**: November 14, 2025
