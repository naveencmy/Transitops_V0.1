
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const { logger } = require('./middleware/logger.middleware');
const env = require('./config/env');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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