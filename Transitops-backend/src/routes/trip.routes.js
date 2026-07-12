
const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/role.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { tripCreateSchema, tripCompleteSchema, tripUpdateSchema } = require('../validators/trip.schema');

router.use(authenticate);

router.get('/', requireRoles(['Dispatcher', 'FleetManager', 'Admin']), tripController.getAll);
router.get('/:id', requireRoles(['Dispatcher', 'FleetManager', 'Admin']), tripController.getById);
router.post('/', requireRoles(['Dispatcher', 'FleetManager', 'Admin']), validateBody(tripCreateSchema), tripController.create);
router.put('/:id', requireRoles(['Dispatcher', 'FleetManager', 'Admin']), validateBody(tripUpdateSchema), tripController.update);
router.post('/:id/dispatch', requireRoles(['Dispatcher', 'FleetManager', 'Admin']), tripController.dispatch);
router.post('/:id/complete', requireRoles(['Dispatcher', 'FleetManager', 'Admin']), validateBody(tripCompleteSchema), tripController.complete);
router.post('/:id/cancel', requireRoles(['Dispatcher', 'FleetManager', 'Admin']), tripController.cancel);
router.delete('/:id', requireRoles(['Dispatcher', 'FleetManager', 'Admin']), tripController.delete);

module.exports = router;