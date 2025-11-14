/**
 * API Integration Tests
 * Tests the complete analysis flow from API endpoint to response
 * Requirements: All
 */

const request = require('supertest');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const analysisRoutes = require('../routes/analysis');

// Create a test app with the same configuration as the main server
function createTestApp() {
  const app = express();

  // Rate limiting - reduced for testing
  const analysisLimiter = rateLimit({
    windowMs: 1000, // 1 second for testing
    max: 5, // 5 requests per window
    message: {
      success: false,
      error: {
        type: 'rate_limit',
        message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
        details: '15분당 최대 10회의 분석 요청이 허용됩니다.'
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/health'
  });

  // CORS configuration
  const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    maxAge: 86400,
    credentials: false
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', analysisLimiter);
  app.use('/api', analysisRoutes);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Global error handling middleware
  const ErrorHandler = require('../utils/ErrorHandler');
  app.use((err, req, res, next) => {
    const errorResponse = ErrorHandler.handle(err, req.path || 'server');
    const statusCode = ErrorHandler.getStatusCode(errorResponse.type);
    
    res.status(statusCode).json({
      success: false,
      error: errorResponse
    });
  });

  return app;
}

describe('API Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('Health Check Endpoint', () => {
    test('should return 200 OK', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
    });

    test('should not be rate limited', async () => {
      // Make multiple health check requests
      for (let i = 0; i < 10; i++) {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
      }
    });
  });

  describe('Analysis Endpoint - Request Validation', () => {
    test('should reject request without URL', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({});

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('URL');
    });

    test('should reject invalid URL format', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'not-a-valid-url' });

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('validation');
    });

    test('should reject non-HTTP(S) protocols', async () => {
      const invalidProtocols = [
        'ftp://example.com',
        'file:///path/to/file',
        'javascript:alert(1)',
        'data:text/html,<h1>Test</h1>'
      ];

      for (const url of invalidProtocols) {
        const response = await request(app)
          .post('/api/analyze')
          .send({ url });

        expect(response.body.success).toBe(false);
        expect(response.body.error.message).toContain('HTTP 또는 HTTPS 프로토콜만 지원됩니다');
      }
    });

    test('should reject localhost URLs', async () => {
      const localhostUrls = [
        'http://localhost',
        'http://localhost:3000',
        'https://localhost:8080',
        'http://127.0.0.1',
        'http://127.0.0.1:3000'
      ];

      for (const url of localhostUrls) {
        const response = await request(app)
          .post('/api/analyze')
          .send({ url });

        expect(response.body.success).toBe(false);
        expect(response.body.error.message).toContain('로컬 또는 사설 IP');
      }
    });

    test('should reject private IP addresses', async () => {
      const privateIPs = [
        'http://192.168.1.1',
        'http://192.168.0.100',
        'http://10.0.0.1',
        'http://10.255.255.255',
        'http://172.16.0.1',
        'http://172.31.255.255'
      ];

      for (const url of privateIPs) {
        const response = await request(app)
          .post('/api/analyze')
          .send({ url });

        expect(response.body.success).toBe(false);
        expect(response.body.error.type).toBe('validation');
        expect(response.body.error.message).toContain('로컬 또는 사설 IP');
      }
    });

    test('should sanitize and trim whitespace from URLs', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: '  https://example.com  ' });

      // Should not fail due to whitespace
      // Will proceed with analysis (may fail with network error, but not validation error)
      if (response.status === 400) {
        expect(response.body.error.type).not.toBe('validation');
      }
    });
  });

  describe('Analysis Endpoint - Response Structure', () => {
    test('should return proper response structure on success', async () => {
      // Note: This test may fail with network error if example.com is not accessible
      // But we're testing the response structure when it succeeds
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'https://example.com' });

      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.tokens).toBeDefined();
        expect(response.body.data.metadata).toBeDefined();
        
        // Check tokens structure
        expect(response.body.data.tokens.colors).toBeDefined();
        expect(response.body.data.tokens.fonts).toBeDefined();
        expect(response.body.data.tokens.spacing).toBeDefined();
        expect(response.body.data.tokens.effects).toBeDefined();
        expect(response.body.data.tokens.animations).toBeDefined();
        
        // Check metadata structure (URL may have trailing slash)
        expect(response.body.data.metadata.analyzedUrl).toMatch(/^https:\/\/example\.com\/?$/);
        expect(response.body.data.metadata.timestamp).toBeDefined();
        expect(response.body.data.metadata.duration).toBeDefined();
      }
    });

    test('should return proper error structure on failure', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'invalid-url' });

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.type).toBeDefined();
      expect(response.body.error.message).toBeDefined();
    });
  });

  describe('Analysis Endpoint - Dynamic Analysis Option', () => {
    test('should accept includeDynamic option', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ 
          url: 'https://example.com',
          options: {
            includeDynamic: true
          }
        });

      // Should not fail due to the option itself
      if (response.status === 200) {
        expect(response.body.data.motionReports).toBeDefined();
      }
    }, 10000); // Increase timeout for dynamic analysis

    test('should not include motion reports when includeDynamic is false', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ 
          url: 'https://example.com',
          options: {
            includeDynamic: false
          }
        });

      if (response.status === 200) {
        expect(response.body.data.motionReports).toBeUndefined();
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'https://this-domain-definitely-does-not-exist-12345.com' });

      // Should return error response, not crash
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    test('should include warnings for partial failures', async () => {
      // This test depends on the actual implementation
      // If a site has some CSS files that fail to download, warnings should be included
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'https://example.com' });

      if (response.status === 200 && response.body.data.metadata.filesFailed > 0) {
        expect(response.body.data.metadata.warnings).toBeDefined();
        expect(Array.isArray(response.body.data.metadata.warnings)).toBe(true);
      }
    });

    test('should handle CORS issues gracefully', async () => {
      // This test depends on encountering a CORS issue
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'https://example.com' });

      if (response.status === 200 && response.body.data.metadata.hasCORSIssues) {
        expect(response.body.data.metadata.warnings).toBeDefined();
        const corsWarning = response.body.data.metadata.warnings.find(w => w.type === 'cors');
        expect(corsWarning).toBeDefined();
      }
    });
  });

  describe('Rate Limiting', () => {
    test('should enforce rate limits', async () => {
      // Make requests up to and beyond the limit
      const responses = [];
      for (let i = 0; i < 6; i++) {
        const response = await request(app)
          .post('/api/analyze')
          .send({ url: 'https://example.com' });
        responses.push(response);
      }

      // At least one request should be rate limited
      const rateLimited = responses.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
      
      // Check the rate limited response structure
      const rateLimitedResponse = responses.find(r => r.status === 429);
      if (rateLimitedResponse) {
        expect(rateLimitedResponse.body.success).toBe(false);
        expect(rateLimitedResponse.body.error.type).toBe('rate_limit');
      }
    });

    test('should include rate limit headers', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'https://example.com' });

      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
    });
  });

  describe('CORS Configuration', () => {
    test('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should allow POST method', async () => {
      const response = await request(app)
        .options('/api/analyze')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST');

      expect(response.headers['access-control-allow-methods']).toContain('POST');
    });

    test('should allow Content-Type header', async () => {
      const response = await request(app)
        .options('/api/analyze')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Headers', 'Content-Type');

      expect(response.status).toBeLessThan(400);
    });
  });
});
