/**
 * Report Controller
 * Handles report generation with CSV export support
 */

const reportService = require('../services/report.service');
const { setCSVHeaders } = require('../utils/helpers');

class ReportController {
  async fuelEfficiency(req, res, next) {
    try {
      const format = req.query.format || 'json';
      const result = await reportService.getFuelEfficiencyReport(format);

      if (format === 'csv') {
        setCSVHeaders(res, 'fuel-efficiency-report.csv');
        return res.send(result.data);
      }

      res.json({ success: true, data: result.data });
    } catch (err) {
      next(err);
    }
  }

  async operationalCost(req, res, next) {
    try {
      const format = req.query.format || 'json';
      const result = await reportService.getOperationalCostReport(format);

      if (format === 'csv') {
        setCSVHeaders(res, 'operational-cost-report.csv');
        return res.send(result.data);
      }

      res.json({ success: true, data: result.data });
    } catch (err) {
      next(err);
    }
  }

  async vehicleROI(req, res, next) {
    try {
      const format = req.query.format || 'json';
      const result = await reportService.getVehicleROIReport(format);

      if (format === 'csv') {
        setCSVHeaders(res, 'vehicle-roi-report.csv');
        return res.send(result.data);
      }

      res.json({ success: true, data: result.data });
    } catch (err) {
      next(err);
    }
  }

  async fleetUtilization(req, res, next) {
    try {
      const data = await reportService.getFleetUtilizationTrend();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async tripStatusDistribution(req, res, next) {
    try {
      const data = await reportService.getTripStatusDistribution();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async revenueExpenseTrend(req, res, next) {
    try {
      const data = await reportService.getRevenueExpenseTrend();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ReportController();
