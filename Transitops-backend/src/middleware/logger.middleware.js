/**
 * Request/Response Logger Middleware
 * Logs incoming requests and their responses
 */

const morgan = require('morgan');
const env = require('../config/env');

// Custom token for response time
morgan.token('response-time-ms', (req, res) => {
  if (!req._startAt || !res._startAt) return '';
  const ms = (res._startAt[0] - req._startAt[0]) * 1000 +
    (res._startAt[1] - req._startAt[1]) / 1e6;
  return `${Math.round(ms)}ms`;
});

// Development format with colors
const devFormat = ':method :url :status :response-time-ms - :res[content-length] bytes';

// Production format (JSON-like)
const prodFormat = (tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: parseInt(tokens.status(req, res), 10),
    responseTime: tokens['response-time'](req, res),
    contentLength: tokens.res(req, res, 'content-length'),
    timestamp: new Date().toISOString(),
    userAgent: tokens['user-agent'](req, res)
  });
};

const logger = env.isProduction()
  ? morgan(prodFormat)
  : morgan(devFormat);

module.exports = { logger };
