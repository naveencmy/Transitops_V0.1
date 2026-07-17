
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/role.middleware');

router.use(authenticate);

// Financial/operational reports restricted to admin, fleet manager, and financial analyst
const analystRoles = ['Admin', 'FleetManager', 'FinancialAnalyst'];
router.get('/fuel-efficiency', requireRoles(analystRoles), reportController.fuelEfficiency);
router.get('/operational-cost', requireRoles(analystRoles), reportController.operationalCost);
router.get('/vehicle-roi', requireRoles(analystRoles), reportController.vehicleROI);
router.get('/fleet-utilization', requireRoles(analystRoles), reportController.fleetUtilization);
router.get('/trip-status', requireRoles(analystRoles), reportController.tripStatusDistribution);
router.get('/revenue-expense', requireRoles(analystRoles), reportController.revenueExpenseTrend);

module.exports = router;