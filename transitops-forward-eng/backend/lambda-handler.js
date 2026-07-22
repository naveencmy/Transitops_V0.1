/**
 * Lambda Handler for TransitOps Backend
 * Wraps the Express app using @vendia/serverless-express
 * 
 * Usage: This file is the Lambda entry point.
 * The Express app is imported from the backend src/app.js
 */

const serverlessExpress = require('@vendia/serverless-express');
const app = require('../../Transitops-backend/src/app');

const handler = serverlessExpress({
  app,
  requestLogging: true,
  logger: {
    info: (msg) => console.log(msg),
    warn: (msg) => console.warn(msg),
    error: (msg) => console.error(msg),
  },
});

module.exports.handler = handler;
