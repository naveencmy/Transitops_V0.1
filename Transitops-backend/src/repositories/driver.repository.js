/**
 * Driver Repository
 * Pure SQL queries for driver operations
 */

const { query } = require('../config/database');

class DriverRepository {
  async findAll(filters = {}) {
    let sql = `
      SELECT d.*, v.registration_number as assigned_vehicle
      FROM drivers d
      LEFT JOIN vehicles v ON d.assigned_vehicle_id = v.id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (filters.status) {
      sql += ` AND d.status = $${paramIdx++}`;
      params.push(filters.status);
    }
    if (filters.search) {
      sql += ` AND (d.full_name ILIKE $${paramIdx} OR d.license_number ILIKE $${paramIdx})`;
      params.push(`%${filters.search}%`);
      paramIdx++;
    }

    sql += ` ORDER BY d.created_at DESC`;
    const result = await query(sql, params);
    return result.rows;
  }

  async findById(id) {
    const result = await query(`
      SELECT d.*, v.registration_number as assigned_vehicle
      FROM drivers d
      LEFT JOIN vehicles v ON d.assigned_vehicle_id = v.id
      WHERE d.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  async findByLicenseNumber(licenseNumber) {
    const result = await query(`
      SELECT * FROM drivers WHERE license_number = $1
    `, [licenseNumber]);
    return result.rows[0] || null;
  }

  async create(driverData) {
    const { full_name, license_number, license_category, license_expiry, contact_number, safety_score, user_id } = driverData;
    const result = await query(`
      INSERT INTO drivers (user_id, full_name, license_number, license_category, license_expiry, contact_number, safety_score, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Available')
      RETURNING *
    `, [user_id || null, full_name, license_number, license_category || null, license_expiry, contact_number || null, safety_score || null]);
    return result.rows[0];
  }

  async update(id, updates) {
    const ALLOWED_COLUMNS = ['full_name', 'license_number', 'license_category', 'license_expiry', 'contact_number', 'safety_score', 'assigned_vehicle_id', 'user_id'];
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && ALLOWED_COLUMNS.includes(key)) {
        fields.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(`
      UPDATE drivers SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `, values);
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await query(`
      DELETE FROM drivers WHERE id = $1 RETURNING id
    `, [id]);
    return result.rows[0] || null;
  }

  async updateStatus(id, status, client = null) {
    const executor = client ? (t, p) => client.query(t, p) : query;
    const result = await executor(`
      UPDATE drivers SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, id]);
    return result.rows[0] || null;
  }

  async countByStatus() {
    const result = await query(`
      SELECT status, COUNT(*) as count
      FROM drivers
      GROUP BY status
    `);
    return result.rows;
  }

  async getAvailableForDispatch() {
    const result = await query(`
      SELECT * FROM drivers
      WHERE status = 'Available'
      AND license_expiry >= CURRENT_DATE
      ORDER BY full_name
    `);
    return result.rows;
  }

  async assignVehicle(driverId, vehicleId) {
    const result = await query(`
      UPDATE drivers SET assigned_vehicle_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [vehicleId, driverId]);
    return result.rows[0] || null;
  }
}

module.exports = new DriverRepository();
