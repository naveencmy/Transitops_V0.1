
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { loginSchema } = require('../validators/auth.schema');

// Rate limit login: 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many login attempts. Please try again after 15 minutes.' } },
  skipSuccessfulRequests: true,
});

// Public routes
router.post('/login', loginLimiter, validateBody(loginSchema), authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;