const { query } = require('../config/database');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const { NotFoundError, ValidationError } = require('../utils/errors');

class UserController {
  async getAll(req, res, next) {
    try {
      const result = await query(`
        SELECT u.id, u.email, u.full_name, u.status, r.name as role
        FROM users u
        JOIN roles r ON u.role_id = r.id
        ORDER BY u.id ASC
      `);
      res.json({ success: true, data: result.rows });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await query(`
        SELECT u.id, u.email, u.full_name, u.status, r.name as role
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = $1
      `, [req.params.id]);
      if (result.rows.length === 0) throw new NotFoundError('User');
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { name, email, role } = req.body;
      if (!name || !email) throw new ValidationError('Name and email are required');

      const roleResult = await query('SELECT id FROM roles WHERE name = $1', [role || 'Dispatcher']);
      if (roleResult.rows.length === 0) throw new ValidationError('Invalid role');
      const roleId = roleResult.rows[0].id;

      const hashedPassword = await bcrypt.hash('changeme123', env.BCRYPT_ROUNDS);
      const result = await query(`
        INSERT INTO users (email, password_hash, full_name, role_id, status)
        VALUES ($1, $2, $3, $4, 'active')
        RETURNING id, email, full_name, status
      `, [email, hashedPassword, name, roleId]);

      const user = result.rows[0];
      const userRole = await query('SELECT name FROM roles WHERE id = $1', [roleId]);
      res.status(201).json({ success: true, data: { ...user, role: userRole.rows[0]?.name } });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { name, role } = req.body;
      const userId = req.params.id;

      const existing = await query('SELECT id FROM users WHERE id = $1', [userId]);
      if (existing.rows.length === 0) throw new NotFoundError('User');

      if (role) {
        const roleResult = await query('SELECT id FROM roles WHERE name = $1', [role]);
        if (roleResult.rows.length === 0) throw new ValidationError('Invalid role');
        await query('UPDATE users SET role_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [roleResult.rows[0].id, userId]);
      }

      if (name) {
        await query('UPDATE users SET full_name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [name, userId]);
      }

      const result = await query(`
        SELECT u.id, u.email, u.full_name, u.status, r.name as role
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = $1
      `, [userId]);
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
      if (result.rows.length === 0) throw new NotFoundError('User');
      res.json({ success: true, message: 'User deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
