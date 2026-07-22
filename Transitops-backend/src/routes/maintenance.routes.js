
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/role.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { maintenanceCreateSchema, maintenanceUpdateSchema } = require('../validators/maintenance.schema');

router.use(authenticate);

router.get('/', requireRoles(['Dispatcher', 'FleetManager', 'Admin']), maintenanceController.getAll);
router.get('/:id', requireRoles(['Dispatcher', 'FleetManager', 'Admin']), maintenanceController.getById);
router.post('/', requireRoles(['FleetManager', 'Admin']), validateBody(maintenanceCreateSchema), maintenanceController.create);
router.post('/:id/close', requireRoles(['FleetManager', 'Admin']), maintenanceController.close);
router.put('/:id', requireRoles(['FleetManager', 'Admin']), validateBody(maintenanceUpdateSchema), maintenanceController.update);
router.delete('/:id', requireRoles(['FleetManager', 'Admin']), maintenanceController.delete);

module.exports = router;