
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const { logger } = require('./middleware/logger.middleware');
const env = require('./config/env');

const app = express();
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

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } },
}));

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

app.use(logger);
app.use('/api/v1', routes);

app.use(notFoundHandler);

app.use(errorHandler);

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