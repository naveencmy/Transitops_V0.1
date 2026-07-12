/**
 * Dashboard Service
 * Aggregates KPIs for the dashboard
 */

const reportRepository = require('../repositories/report.repository');
const { calculateFleetUtilization } = require('../utils/helpers');

class DashboardService {
  async getKPIs() {
    const kpis = await reportRepository.getDashboardKPIs();

    // Calculate fleet utilization percentage
    const totalVehicles = parseInt(kpis.total_vehicles, 10) || 0;
    const onTripVehicles = parseInt(kpis.on_trip_vehicles, 10) || 0;
    const inMaintenance = parseInt(kpis.in_maintenance, 10) || 0;
    const activeVehicles = onTripVehicles + inMaintenance;

    const fleetUtilization = calculateFleetUtilization(activeVehicles, totalVehicles);

    return {
      total_vehicles: parseInt(kpis.total_vehicles, 10),
      available_vehicles: parseInt(kpis.available_vehicles, 10),
      in_maintenance: parseInt(kpis.in_maintenance, 10),
      on_trip_vehicles: parseInt(kpis.on_trip_vehicles, 10),
      active_trips: parseInt(kpis.active_trips, 10),
      pending_trips: parseInt(kpis.pending_trips, 10),
      drivers_on_duty: parseInt(kpis.drivers_on_duty, 10),
      total_drivers: parseInt(kpis.total_drivers, 10),
      fleet_utilization_pct: fleetUtilization
    };
  }
}

module.exports = new DashboardService();
