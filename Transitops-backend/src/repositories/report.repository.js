/**
 * Report Repository
 * Aggregation queries for analytics and reports
 */

const { query } = require('../config/database');

class ReportRepository {
  // Dashboard KPIs
  async getDashboardKPIs() {
    const result = await query(`
      SELECT
        (SELECT COUNT(*) FROM vehicles) as total_vehicles,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'Available') as available_vehicles,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'InShop') as in_maintenance,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'OnTrip') as on_trip_vehicles,
        (SELECT COUNT(*) FROM trips WHERE status IN ('Dispatched', 'InProgress')) as active_trips,
        (SELECT COUNT(*) FROM trips WHERE status = 'Draft') as pending_trips,
        (SELECT COUNT(*) FROM drivers WHERE status = 'OnTrip') as drivers_on_duty,
        (SELECT COUNT(*) FROM drivers) as total_drivers
    `);
    return result.rows[0];
  }

  // Fuel Efficiency Report
  async getFuelEfficiencyReport() {
    const result = await query(`
      SELECT 
        v.id,
        v.registration_number,
        v.name as vehicle_name,
        COALESCE(SUM(t.actual_distance_km), 0) as total_distance,
        COALESCE(SUM(f.liters), 0) as total_fuel_liters,
        CASE 
          WHEN COALESCE(SUM(f.liters), 0) > 0 
          THEN ROUND(COALESCE(SUM(t.actual_distance_km), 0) / SUM(f.liters), 2)
          ELSE 0 
        END as fuel_efficiency_km_per_liter
      FROM vehicles v
      LEFT JOIN trips t ON v.id = t.vehicle_id AND t.status = 'Completed'
      LEFT JOIN fuel_logs f ON v.id = f.vehicle_id
      GROUP BY v.id, v.registration_number, v.name
      ORDER BY v.registration_number
    `);
    return result.rows;
  }

  // Operational Cost Report
  async getOperationalCostReport() {
    const result = await query(`
      SELECT 
        v.id,
        v.registration_number,
        v.name as vehicle_name,
        v.acquisition_cost,
        COALESCE(SUM(e.amount), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN e.category = 'Fuel' THEN e.amount ELSE 0 END), 0) as fuel_cost,
        COALESCE(SUM(CASE WHEN e.category = 'Maintenance' THEN e.amount ELSE 0 END), 0) as maintenance_cost,
        COALESCE(SUM(t.revenue), 0) as total_revenue
      FROM vehicles v
      LEFT JOIN expenses e ON v.id = e.vehicle_id
      LEFT JOIN trips t ON v.id = t.vehicle_id AND t.status = 'Completed'
      GROUP BY v.id, v.registration_number, v.name, v.acquisition_cost
      ORDER BY v.registration_number
    `);
    return result.rows;
  }

  // Vehicle ROI Report
  async getVehicleROIReport() {
    const result = await query(`
      SELECT 
        v.id,
        v.registration_number,
        v.name as vehicle_name,
        v.acquisition_cost,
        COALESCE(SUM(t.revenue), 0) as total_revenue,
        COALESCE(SUM(e.amount), 0) as total_operational_cost,
        COALESCE(SUM(CASE WHEN e.category = 'Fuel' THEN e.amount ELSE 0 END), 0) as fuel_cost,
        COALESCE(SUM(CASE WHEN e.category = 'Maintenance' THEN e.amount ELSE 0 END), 0) as maintenance_cost,
        CASE 
          WHEN v.acquisition_cost > 0 
          THEN ROUND(
            ((COALESCE(SUM(t.revenue), 0) - COALESCE(SUM(e.amount), 0)) / v.acquisition_cost) * 100, 
            2
          )
          ELSE 0 
        END as roi_percentage
      FROM vehicles v
      LEFT JOIN trips t ON v.id = t.vehicle_id AND t.status = 'Completed'
      LEFT JOIN expenses e ON v.id = e.vehicle_id
      GROUP BY v.id, v.registration_number, v.name, v.acquisition_cost
      ORDER BY roi_percentage DESC
    `);
    return result.rows;
  }

  // Fleet utilization over time
  async getFleetUtilizationTrend() {
    const result = await query(`
      SELECT 
        DATE_TRUNC('day', t.dispatched_at) as date,
        COUNT(DISTINCT t.vehicle_id) as active_vehicles,
        (SELECT COUNT(*) FROM vehicles WHERE status != 'Retired') as total_fleet
      FROM trips t
      WHERE t.dispatched_at >= CURRENT_DATE - INTERVAL '30 days'
      AND t.status IN ('Dispatched', 'InProgress', 'Completed')
      GROUP BY DATE_TRUNC('day', t.dispatched_at)
      ORDER BY date DESC
      LIMIT 30
    `);
    return result.rows;
  }

  // Trip status distribution
  async getTripStatusDistribution() {
    const result = await query(`
      SELECT status, COUNT(*) as count
      FROM trips
      GROUP BY status
    `);
    return result.rows;
  }

  // Revenue vs Expenses trend
  async getRevenueExpenseTrend() {
    const result = await query(`
      SELECT 
        DATE_TRUNC('month', t.completed_at) as month,
        COALESCE(SUM(t.revenue), 0) as revenue,
        COALESCE(SUM(e.amount), 0) as expenses
      FROM trips t
      LEFT JOIN expenses e ON DATE_TRUNC('month', t.completed_at) = DATE_TRUNC('month', e.created_at)
      WHERE t.completed_at >= CURRENT_DATE - INTERVAL '12 months'
      AND t.status = 'Completed'
      GROUP BY DATE_TRUNC('month', t.completed_at)
      ORDER BY month DESC
      LIMIT 12
    `);
    return result.rows;
  }
}

module.exports = new ReportRepository();
