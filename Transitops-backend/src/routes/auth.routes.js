
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { loginSchema } = require('../validators/auth.schema');

// Public routes
router.post('/login', validateBody(loginSchema), authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;