
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/fuel-efficiency', reportController.fuelEfficiency);
router.get('/operational-cost', reportController.operationalCost);
router.get('/vehicle-roi', reportController.vehicleROI);
router.get('/fleet-utilization', reportController.fleetUtilization);
router.get('/trip-status', reportController.tripStatusDistribution);
router.get('/revenue-expense', reportController.revenueExpenseTrend);

module.exports = router;