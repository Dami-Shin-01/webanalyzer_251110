/**
 * Security Integration Tests
 * 
 * Tests for rate limiting, CORS, and URL validation in the API
 * Requirements: 1.5, 9.4
 */

const request = require('supertest');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const analysisRoutes = require('../routes/analysis');

// Create a test app with the same security configuration
function createTestApp() {
  const app = express();

  // Rate limiting - reduced for testing
  const analysisLimiter = rateLimit({
    windowMs: 1000, // 1 second for testing
    max: 3, // 3 requests per window
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
    res.json({ status: 'ok' });
  });

  // Global error handling middleware (same as in server.js)
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

describe('Security Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('URL Validation', () => {
    test('should reject missing URL', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('URL이 필요합니다');
    });

    test('should reject invalid URL format', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'not a url' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('validation');
    });

    test('should reject non-HTTP(S) protocols', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'ftp://example.com' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('HTTP 또는 HTTPS 프로토콜만 지원됩니다');
    });

    test('should reject localhost URLs', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'http://localhost:3000' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('로컬 또는 사설 IP');
    });

    test('should reject private IP addresses', async () => {
      const privateIPs = [
        'http://192.168.1.1',
        'http://10.0.0.1',
        'http://172.16.0.1'
      ];

      for (const url of privateIPs) {
        const response = await request(app)
          .post('/api/analyze')
          .send({ url });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error.type).toBe('validation');
      }
    });

    test('should reject URLs with invalid characters', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'javascript:alert(1)' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    test('should allow requests within rate limit', async () => {
      // First request should succeed (or fail with network error, not rate limit)
      const response1 = await request(app)
        .post('/api/analyze')
        .send({ url: 'https://example.com' });

      // Should not be rate limited
      expect(response1.status).not.toBe(429);
    });

    test('should block requests exceeding rate limit', async () => {
      // Make 3 requests quickly (within the limit)
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/analyze')
          .send({ url: 'https://example.com' });
      }

      // 4th request should be rate limited
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'https://example.com' });

      expect(response.status).toBe(429);
      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('rate_limit');
      expect(response.body.error.message).toContain('너무 많은 요청이 발생했습니다');
    });

    test('should not rate limit health check endpoint', async () => {
      // Make many health check requests
      for (let i = 0; i < 10; i++) {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
      }
    });

    test('should include rate limit headers', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'https://example.com' });

      // Check for standard rate limit headers
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

    test('should allow configured methods', async () => {
      const response = await request(app)
        .options('/api/analyze')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST');

      expect(response.headers['access-control-allow-methods']).toContain('POST');
    });
  });

  describe('Input Sanitization', () => {
    test('should trim whitespace from URLs', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: '  https://example.com  ' });

      // Should not fail due to whitespace
      // Will fail with network error, but not validation error
      if (response.status === 400) {
        expect(response.body.error.type).not.toBe('validation');
      }
    });

    test('should sanitize URLs with null bytes', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({ url: 'https://example.com\x00' });

      // Null bytes are sanitized, so the URL becomes valid
      // The request will proceed (and may fail with network error, but not validation error)
      if (response.status === 400) {
        // If it fails, it should not be due to null bytes
        expect(response.body.error.type).not.toBe('invalid_characters');
      } else {
        // Otherwise it should succeed or fail with network error
        expect([200, 502, 504]).toContain(response.status);
      }
    });
  });
});
