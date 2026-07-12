/**
 * Auth Controller
 * Handles authentication endpoints
 */

const authService = require('../services/auth.service');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({ 
        success: true, 
        data: result 
      });
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id);
      res.json({ 
        success: true, 
        data: user 
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
