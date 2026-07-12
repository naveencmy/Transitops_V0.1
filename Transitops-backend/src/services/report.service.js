/**
 * Report Service
 * Handles report generation with CSV export support
 */

const reportRepository = require('../repositories/report.repository');
const { generateCSV } = require('../utils/helpers');

class ReportService {
  async getFuelEfficiencyReport(format = 'json') {
    const data = await reportRepository.getFuelEfficiencyReport();

    if (format === 'csv') {
      const headers = [
        { key: 'registration_number', label: 'Vehicle Plate' },
        { key: 'vehicle_name', label: 'Vehicle Name' },
        { key: 'total_distance', label: 'Total Distance (km)' },
        { key: 'total_fuel_liters', label: 'Total Fuel (L)' },
        { key: 'fuel_efficiency_km_per_liter', label: 'Efficiency (km/L)' }
      ];
      return { data: generateCSV(data, headers), contentType: 'csv' };
    }

    return { data, contentType: 'json' };
  }

  async getOperationalCostReport(format = 'json') {
    const data = await reportRepository.getOperationalCostReport();

    if (format === 'csv') {
      const headers = [
        { key: 'registration_number', label: 'Vehicle Plate' },
        { key: 'vehicle_name', label: 'Vehicle Name' },
        { key: 'acquisition_cost', label: 'Acquisition Cost' },
        { key: 'total_expenses', label: 'Total Expenses' },
        { key: 'fuel_cost', label: 'Fuel Cost' },
        { key: 'maintenance_cost', label: 'Maintenance Cost' },
        { key: 'total_revenue', label: 'Total Revenue' }
      ];
      return { data: generateCSV(data, headers), contentType: 'csv' };
    }

    return { data, contentType: 'json' };
  }

  async getVehicleROIReport(format = 'json') {
    const data = await reportRepository.getVehicleROIReport();

    if (format === 'csv') {
      const headers = [
        { key: 'registration_number', label: 'Vehicle Plate' },
        { key: 'vehicle_name', label: 'Vehicle Name' },
        { key: 'acquisition_cost', label: 'Acquisition Cost' },
        { key: 'total_revenue', label: 'Total Revenue' },
        { key: 'total_operational_cost', label: 'Operational Cost' },
        { key: 'roi_percentage', label: 'ROI %' }
      ];
      return { data: generateCSV(data, headers), contentType: 'csv' };
    }

    return { data, contentType: 'json' };
  }

  async getFleetUtilizationTrend() {
    return await reportRepository.getFleetUtilizationTrend();
  }

  async getTripStatusDistribution() {
    return await reportRepository.getTripStatusDistribution();
  }

  async getRevenueExpenseTrend() {
    return await reportRepository.getRevenueExpenseTrend();
  }
}

module.exports = new ReportService();
