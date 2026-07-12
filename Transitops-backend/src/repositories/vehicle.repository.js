/**
 * Vehicle Repository
 * Pure SQL queries for vehicle operations
 * No business logic - just data access
 */

const { query } = require('../config/database');

class VehicleRepository {
  async findAll(filters = {}) {
    let sql = `
      SELECT v.*, d.full_name as assigned_driver
      FROM vehicles v
      LEFT JOIN drivers d ON v.id = d.assigned_vehicle_id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (filters.status) {
      sql += ` AND v.status = $${paramIdx++}`;
      params.push(filters.status);
    }
    if (filters.type) {
      sql += ` AND v.type = $${paramIdx++}`;
      params.push(filters.type);
    }
    if (filters.search) {
      sql += ` AND (v.registration_number ILIKE $${paramIdx} OR v.name ILIKE $${paramIdx})`;
      params.push(`%${filters.search}%`);
      paramIdx++;
    }

    sql += ` ORDER BY v.created_at DESC`;
    const result = await query(sql, params);
    return result.rows;
  }

  async findById(id) {
    const result = await query(`
      SELECT v.*, d.full_name as assigned_driver
      FROM vehicles v
      LEFT JOIN drivers d ON v.id = d.assigned_vehicle_id
      WHERE v.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  async findByRegistrationNumber(registrationNumber) {
    const result = await query(`
      SELECT * FROM vehicles WHERE registration_number = $1
    `, [registrationNumber]);
    return result.rows[0] || null;
  }

  async create(vehicleData) {
    const { registration_number, name, model, type, max_load_capacity_kg, odometer_km, acquisition_cost } = vehicleData;
    const result = await query(`
      INSERT INTO vehicles (registration_number, name, model, type, max_load_capacity_kg, odometer_km, acquisition_cost, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Available')
      RETURNING *
    `, [registration_number, name, model || null, type || null, max_load_capacity_kg, odometer_km || 0, acquisition_cost || null]);
    return result.rows[0];
  }

  async update(id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(`
      UPDATE vehicles SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `, values);
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await query(`
      DELETE FROM vehicles WHERE id = $1 RETURNING id
    `, [id]);
    return result.rows[0] || null;
  }

  async updateStatus(id, status, client = null) {
    const executor = client || query;
    const result = await executor(`
      UPDATE vehicles SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, id]);
    return result.rows[0] || null;
  }

  async updateOdometer(id, odometerKm, client = null) {
    const executor = client || query;
    const result = await executor(`
      UPDATE vehicles SET odometer_km = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [odometerKm, id]);
    return result.rows[0] || null;
  }

  async countByStatus() {
    const result = await query(`
      SELECT status, COUNT(*) as count
      FROM vehicles
      GROUP BY status
    `);
    return result.rows;
  }

  async getAvailableForDispatch() {
    const result = await query(`
      SELECT * FROM vehicles
      WHERE status = 'Available'
      ORDER BY name
    `);
    return result.rows;
  }
}

module.exports = new VehicleRepository();
