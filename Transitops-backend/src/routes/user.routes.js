const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/role.middleware');

router.use(authenticate);

router.get('/', requireRoles(['Admin']), userController.getAll);
router.get('/:id', requireRoles(['Admin']), userController.getById);
router.post('/', requireRoles(['Admin']), userController.create);
router.put('/:id', requireRoles(['Admin']), userController.update);
router.delete('/:id', requireRoles(['Admin']), userController.delete);

module.exports = router;
