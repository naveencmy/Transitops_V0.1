// src/routes/expense.routes.js
const express = require('express');
const router = express.Router();
const fuelExpenseController = require('../controllers/fuelExpense.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/role.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { expenseSchema } = require('../validators/fuelExpense.schema');
const { ROLES } = require('../utils/constants');

// Apply authentication to all expense endpoints
router.use(authenticate);

router.route('/')
  .get(
    requireRoles([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST]), 
    fuelExpenseController.getExpenses
  )
  .post(
    requireRoles([ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST]), 
    validateBody(expenseSchema), 
    fuelExpenseController.createExpense
  );

module.exports = router;