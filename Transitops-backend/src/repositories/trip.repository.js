/**
 * Trip Repository
 * Pure SQL queries for trip operations
 */

const { query } = require('../config/database');

class TripRepository {
  async findAll(filters = {}) {
    let sql = `
      SELECT 
        t.*,
        v.registration_number as vehicle_plate,
        v.name as vehicle_name,
        v.type as vehicle_type,
        d.full_name as driver_name,
        d.license_number as driver_license
      FROM trips t
      JOIN vehicles v ON t.vehicle_id = v.id
      JOIN drivers d ON t.driver_id = d.id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (filters.status) {
      sql += ` AND t.status = $${paramIdx++}`;
      params.push(filters.status);
    }
    if (filters.vehicle_id) {
      sql += ` AND t.vehicle_id = $${paramIdx++}`;
      params.push(filters.vehicle_id);
    }
    if (filters.driver_id) {
      sql += ` AND t.driver_id = $${paramIdx++}`;
      params.push(filters.driver_id);
    }
    if (filters.search) {
      sql += ` AND (t.source ILIKE $${paramIdx} OR t.destination ILIKE $${paramIdx} OR t.trip_code ILIKE $${paramIdx})`;
      params.push(`%${filters.search}%`);
      paramIdx++;
    }

    sql += ` ORDER BY t.created_at DESC`;
    const result = await query(sql, params);
    return result.rows;
  }

  async findById(id) {
    const result = await query(`
      SELECT 
        t.*,
        v.registration_number as vehicle_plate,
        v.name as vehicle_name,
        v.type as vehicle_type,
        d.full_name as driver_name,
        d.license_number as driver_license
      FROM trips t
      JOIN vehicles v ON t.vehicle_id = v.id
      JOIN drivers d ON t.driver_id = d.id
      WHERE t.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  async findByTripCode(tripCode) {
    const result = await query(`
      SELECT * FROM trips WHERE trip_code = $1
    `, [tripCode]);
    return result.rows[0] || null;
  }

  async create(tripData, client = null) {
    const executor = client || query;
    const { trip_code, source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, revenue } = tripData;
    const result = await executor(`
      INSERT INTO trips (trip_code, source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, revenue, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Draft')
      RETURNING *
    `, [trip_code, source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km || null, revenue || null]);
    return result.rows[0];
  }

  async update(id, updates, client = null) {
    const executor = client ? (t, p) => client.query(t, p) : query;
    const ALLOWED_COLUMNS = ['source', 'destination', 'vehicle_id', 'driver_id', 'cargo_weight_kg', 'planned_distance_km', 'actual_distance_km', 'fuel_consumed_liters', 'revenue', 'status', 'dispatched_at', 'completed_at'];
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
    const result = await executor(`
      UPDATE trips SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `, values);
    return result.rows[0] || null;
  }

  async updateStatus(id, status, client = null) {
    const executor = client ? (t, p) => client.query(t, p) : query;
    const updates = { status };

    if (status === 'Dispatched') {
      updates.dispatched_at = new Date();
    } else if (status === 'Completed') {
      updates.completed_at = new Date();
    }

    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }

    values.push(id);
    const result = await executor(`
      UPDATE trips SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${idx}
      RETURNING *
    `, values);
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await query(`
      DELETE FROM trips WHERE id = $1 RETURNING id
    `, [id]);
    return result.rows[0] || null;
  }

  async findActiveByVehicle(vehicleId) {
    const result = await query(`
      SELECT * FROM trips
      WHERE vehicle_id = $1 AND status IN ('Dispatched', 'InProgress')
    `, [vehicleId]);
    return result.rows;
  }

  async findActiveByDriver(driverId) {
    const result = await query(`
      SELECT * FROM trips
      WHERE driver_id = $1 AND status IN ('Dispatched', 'InProgress')
    `, [driverId]);
    return result.rows;
  }

  async countByStatus() {
    const result = await query(`
      SELECT status, COUNT(*) as count
      FROM trips
      GROUP BY status
    `);
    return result.rows;
  }
}

module.exports = new TripRepository();
