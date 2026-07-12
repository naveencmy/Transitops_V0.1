/**
 * Auth Service
 * Handles authentication logic: login, token generation
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const env = require('../config/env');
const { UnauthorizedError, ValidationError } = require('../utils/errors');

class AuthService {
  /**
   * Authenticate user and generate JWT
   * @param {string} email 
   * @param {string} password 
   * @returns {Object} { token, user }
   */
  async login(email, password) {
    // Find user with role
    const result = await query(`
      SELECT u.id, u.email, u.password_hash, u.full_name, u.status, r.name as role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.email = $1
    `, [email]);

    const user = result.rows[0];
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check status
    if (user.status !== 'active') {
      throw new UnauthorizedError('Account is inactive');
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword
    };
  }

  /**
   * Create a new user (for seeding/admin)
   * @param {Object} userData 
   * @returns {Object} Created user
   */
  async createUser(userData) {
    const { email, password, full_name, role_id } = userData;

    // Check if email exists
    const existing = await query(`
      SELECT id FROM users WHERE email = $1
    `, [email]);

    if (existing.rows.length > 0) {
      throw new ValidationError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, env.BCRYPT_ROUNDS);

    const result = await query(`
      INSERT INTO users (email, password_hash, full_name, role_id, status)
      VALUES ($1, $2, $3, $4, 'active')
      RETURNING id, email, full_name, status
    `, [email, hashedPassword, full_name, role_id]);

    return result.rows[0];
  }

  /**
   * Get user by ID
   * @param {number} userId 
   * @returns {Object|null}
   */
  async getUserById(userId) {
    const result = await query(`
      SELECT u.id, u.email, u.full_name, u.status, r.name as role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1
    `, [userId]);
    return result.rows[0] || null;
  }
}

module.exports = new AuthService();
