/**
 * Dashboard Controller
 * Handles KPI and analytics endpoints
 */

const dashboardService = require('../services/dashboard.service');

class DashboardController {
  async getKPIs(req, res, next) {
    try {
      const kpis = await dashboardService.getKPIs();
      res.json({ success: true, data: kpis });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DashboardController();
