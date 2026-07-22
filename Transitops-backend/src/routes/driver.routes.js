
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/role.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { driverCreateSchema, driverUpdateSchema } = require('../validators/driver.schema');

router.use(authenticate);

router.get('/', requireRoles(['Dispatcher', 'SafetyOfficer', 'FleetManager', 'Admin']), driverController.getAll);
router.get('/:id', requireRoles(['Dispatcher', 'SafetyOfficer', 'FleetManager', 'Admin']), driverController.getById);
router.post('/', requireRoles(['SafetyOfficer', 'FleetManager', 'Admin']), validateBody(driverCreateSchema), driverController.create);
router.put('/:id', requireRoles(['SafetyOfficer', 'FleetManager', 'Admin']), validateBody(driverUpdateSchema), driverController.update);
router.delete('/:id', requireRoles(['SafetyOfficer', 'FleetManager', 'Admin']), driverController.delete);

module.exports = router;