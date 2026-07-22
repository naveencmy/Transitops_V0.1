
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/role.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { vehicleCreateSchema, vehicleUpdateSchema } = require('../validators/vehicle.schema');

router.use(authenticate);

router.get('/', requireRoles(['Dispatcher', 'FleetManager', 'FinancialAnalyst', 'Admin']), vehicleController.getAll);
router.get('/:id', requireRoles(['Dispatcher', 'FleetManager', 'FinancialAnalyst', 'Admin']), vehicleController.getById);
router.post('/', requireRoles(['FleetManager', 'Admin']), validateBody(vehicleCreateSchema), vehicleController.create);
router.put('/:id', requireRoles(['FleetManager', 'Admin']), validateBody(vehicleUpdateSchema), vehicleController.update);
router.delete('/:id', requireRoles(['FleetManager', 'Admin']), vehicleController.delete);

module.exports = router;