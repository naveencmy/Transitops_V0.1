/**
 * Maintenance Repository
 * Pure SQL queries for maintenance operations
 */

const { query } = require('../config/database');

class MaintenanceRepository {
  async findAll(filters = {}) {
    let sql = `
      SELECT 
        m.*,
        v.registration_number as vehicle_plate,
        v.name as vehicle_name
      FROM maintenance_logs m
      JOIN vehicles v ON m.vehicle_id = v.id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (filters.status) {
      sql += ` AND m.status = $${paramIdx++}`;
      params.push(filters.status);
    }
    if (filters.vehicle_id) {
      sql += ` AND m.vehicle_id = $${paramIdx++}`;
      params.push(filters.vehicle_id);
    }

    sql += ` ORDER BY m.created_at DESC`;
    const result = await query(sql, params);
    return result.rows;
  }

  async findById(id) {
    const result = await query(`
      SELECT 
        m.*,
        v.registration_number as vehicle_plate,
        v.name as vehicle_name
      FROM maintenance_logs m
      JOIN vehicles v ON m.vehicle_id = v.id
      WHERE m.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  async create(maintenanceData, client = null) {
    const executor = client || query;
    const { vehicle_id, maintenance_type, description, cost, scheduled_date } = maintenanceData;
    const result = await executor(`
      INSERT INTO maintenance_logs (vehicle_id, maintenance_type, description, cost, status, scheduled_date)
      VALUES ($1, $2, $3, $4, 'InProgress', $5)
      RETURNING *
    `, [vehicle_id, maintenance_type, description || null, cost || null, scheduled_date || null]);
    return result.rows[0];
  }

  async update(id, updates, client = null) {
    const executor = client || query;
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
    const result = await executor(`
      UPDATE maintenance_logs SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `, values);
    return result.rows[0] || null;
  }

  async close(id, client = null) {
    const executor = client || query;
    const result = await executor(`
      UPDATE maintenance_logs 
      SET status = 'Completed', completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id]);
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await query(`
      DELETE FROM maintenance_logs WHERE id = $1 RETURNING id
    `, [id]);
    return result.rows[0] || null;
  }

  async findOpenByVehicle(vehicleId) {
    const result = await query(`
      SELECT * FROM maintenance_logs
      WHERE vehicle_id = $1 AND status IN ('Scheduled', 'InProgress')
    `, [vehicleId]);
    return result.rows;
  }

  async countByStatus() {
    const result = await query(`
      SELECT status, COUNT(*) as count
      FROM maintenance_logs
      GROUP BY status
    `);
    return result.rows;
  }

  async getTotalCost() {
    const result = await query(`
      SELECT COALESCE(SUM(cost), 0) as total_cost
      FROM maintenance_logs
      WHERE status = 'Completed'
    `);
    return parseFloat(result.rows[0].total_cost);
  }
}

module.exports = new MaintenanceRepository();
