/**
 * Fuel & Expense Repository
 * Pure SQL queries for fuel logs and expenses
 */

const { query } = require('../config/database');

class FuelExpenseRepository {
  // Fuel Logs
  async findAllFuelLogs(filters = {}) {
    let sql = `
      SELECT 
        f.*,
        v.registration_number as vehicle_plate
      FROM fuel_logs f
      JOIN vehicles v ON f.vehicle_id = v.id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (filters.vehicle_id) {
      sql += ` AND f.vehicle_id = $${paramIdx++}`;
      params.push(filters.vehicle_id);
    }

    sql += ` ORDER BY f.created_at DESC`;
    const result = await query(sql, params);
    return result.rows;
  }

  async createFuelLog(fuelData, client = null) {
    const executor = client ? (t, p) => client.query(t, p) : query;
    const { vehicle_id, trip_id, liters, cost_per_liter, total_cost, odometer_reading, station } = fuelData;
    const result = await executor(`
      INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost_per_liter, total_cost, odometer_reading, station)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [vehicle_id, trip_id || null, liters, cost_per_liter, total_cost, odometer_reading, station || null]);
    return result.rows[0];
  }

  async getFuelStats() {
    const result = await query(`
      SELECT 
        COALESCE(SUM(total_cost), 0) as total_fuel_cost,
        COALESCE(SUM(liters), 0) as total_liters,
        COUNT(DISTINCT vehicle_id) as vehicle_count
      FROM fuel_logs
    `);
    return result.rows[0];
  }

  async getFuelByVehicle() {
    const result = await query(`
      SELECT 
        v.id,
        v.registration_number,
        COALESCE(SUM(f.liters), 0) as total_liters,
        COALESCE(SUM(f.total_cost), 0) as total_cost,
        COUNT(f.id) as refuel_count
      FROM vehicles v
      LEFT JOIN fuel_logs f ON v.id = f.vehicle_id
      GROUP BY v.id, v.registration_number
      ORDER BY v.registration_number
    `);
    return result.rows;
  }

  // Expenses
  async findAllExpenses(filters = {}) {
    let sql = `
      SELECT 
        e.*,
        v.registration_number as vehicle_plate
      FROM expenses e
      LEFT JOIN vehicles v ON e.vehicle_id = v.id
      WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (filters.category) {
      sql += ` AND e.category = $${paramIdx++}`;
      params.push(filters.category);
    }
    if (filters.vehicle_id) {
      sql += ` AND e.vehicle_id = $${paramIdx++}`;
      params.push(filters.vehicle_id);
    }

    sql += ` ORDER BY e.created_at DESC`;
    const result = await query(sql, params);
    return result.rows;
  }

  async createExpense(expenseData, client = null) {
    const executor = client ? (t, p) => client.query(t, p) : query;
    const { trip_id, vehicle_id, category, amount, description } = expenseData;
    const result = await executor(`
      INSERT INTO expenses (trip_id, vehicle_id, category, amount, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [trip_id || null, vehicle_id || null, category, amount, description || null]);
    return result.rows[0];
  }

  async getExpenseStats() {
    const result = await query(`
      SELECT 
        COALESCE(SUM(amount), 0) as total_expenses,
        category,
        COUNT(*) as count
      FROM expenses
      GROUP BY category
      ORDER BY total_expenses DESC
    `);
    return result.rows;
  }

  async getWeeklyTrends() {
    const result = await query(`
      SELECT 
        DATE_TRUNC('week', created_at) as week,
        COALESCE(SUM(CASE WHEN category = 'Fuel' THEN amount ELSE 0 END), 0) as fuel_cost,
        COALESCE(SUM(CASE WHEN category = 'Maintenance' THEN amount ELSE 0 END), 0) as maintenance_cost
      FROM expenses
      WHERE created_at >= CURRENT_DATE - INTERVAL '4 weeks'
      GROUP BY DATE_TRUNC('week', created_at)
      ORDER BY week DESC
      LIMIT 4
    `);
    return result.rows;
  }
}

module.exports = new FuelExpenseRepository();
