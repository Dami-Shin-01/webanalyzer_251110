const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const analysisRoutes = require('./routes/analysis');
const ErrorHandler = require('./utils/ErrorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Production logging configuration
if (NODE_ENV === 'production') {
  // Use combined format for production (Apache style)
  app.use(morgan('combined'));
} else {
  // Use dev format for development (colored, concise)
  app.use(morgan('dev'));
}

// Rate limiting middleware - 15분당 10회 (Requirement 9.4)
const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window per IP
  message: {
    success: false,
    error: {
      type: 'rate_limit',
      message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
      details: '15분당 최대 10회의 분석 요청이 허용됩니다.'
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for health check
  skip: (req) => req.path === '/health'
});

// CORS configuration - environment variable based (Requirement 9.4)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://webanalyzer-251110.vercel.app',
  // Allow any Vercel preview deployments
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or is a Vercel deployment
    if (allowedOrigins.includes(origin) || origin.includes('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
  credentials: false
};

// Security middleware - helmet for security headers
app.use(helmet({
  contentSecurityPolicy: false, // Allow external resources for analysis
  crossOriginEmbedderPolicy: false
}));

// Compression middleware - gzip compression for responses
app.use(compression());

// Apply CORS to all routes
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to API routes
app.use('/api', analysisLimiter);

// Routes
app.use('/api', analysisRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      type: 'not_found',
      message: '요청한 엔드포인트를 찾을 수 없습니다.',
      path: req.path
    }
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const errorResponse = ErrorHandler.handle(err, req.path || 'server');
  const statusCode = ErrorHandler.getStatusCode(errorResponse.type);
  
  res.status(statusCode).json({
    success: false,
    error: errorResponse
  });
});

// Start server
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 Project Snapshot Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📍 Host: ${HOST}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/analyze`);
  
  if (NODE_ENV === 'production') {
    console.log('✅ Production mode: Compression and security headers enabled');
    console.log(`🔒 CORS allowed origin: ${process.env.FRONTEND_URL}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
