
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const { logger } = require('./middleware/logger.middleware');
const env = require('./config/env');

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  crossOriginEmbedderPolicy: false,
}));

// CORS — read from env, fallback to localhost dev
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Global rate limit: 200 requests per 15 minutes per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } },
}));

// Body parsing with size limits
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Request logging
app.use(logger);

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Only start server if this file is run directly (not imported in tests)
if (require.main === module) {
  const PORT = env.PORT;

  app.listen(PORT, () => {
    console.log('\u2554' + '\u2550'.repeat(60) + '\u2557');
    console.log('\u2551           TransitOps - Smart Transport Platform            \u2551');
    console.log('\u2560' + '\u2550'.repeat(60) + '\u2563');
    console.log(`\u2551  Server running on port ${PORT.toString().padEnd(43)}\u2551`);
    console.log(`\u2551  Environment: ${env.NODE_ENV.padEnd(47)}\u2551`);
    console.log('\u255A' + '\u2550'.repeat(60) + '\u255D');
  });
}

module.exports = app;