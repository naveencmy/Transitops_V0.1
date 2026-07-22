
const VEHICLE_STATUS = {
  AVAILABLE: 'Available',
  ON_TRIP: 'OnTrip',
  IN_SHOP: 'InShop',
  RETIRED: 'Retired'
};

const DRIVER_STATUS = {
  AVAILABLE: 'Available',
  ON_TRIP: 'OnTrip',
  OFF_DUTY: 'OffDuty',
  SUSPENDED: 'Suspended'
};

const TRIP_STATUS = {
  DRAFT: 'Draft',
  DISPATCHED: 'Dispatched',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DELAYED: 'Delayed'
};

const MAINTENANCE_STATUS = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  OVERDUE: 'Overdue'
};

const EXPENSE_CATEGORY = {
  FUEL: 'Fuel',
  MAINTENANCE: 'Maintenance',
  TOLLS: 'Tolls',
  INSURANCE: 'Insurance',
  SALARIES: 'Salaries',
  OTHER: 'Other'
};

const ROLES = {
  ADMIN: 'Admin',
  FLEET_MANAGER: 'FleetManager',
  DISPATCHER: 'Dispatcher',
  SAFETY_OFFICER: 'SafetyOfficer',
  FINANCIAL_ANALYST: 'FinancialAnalyst',
  DRIVER: 'Driver'
};

/**
 * Role-based access control map
 * Defines which routes/modules each role can access
 * Admin has access to everything
 *
 * NOTE: This map is used by requireRole() middleware.
 * For explicit role checks, prefer requireRoles([...]) in route files.
 */
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['*'],
  [ROLES.FLEET_MANAGER]: [
    'dashboard', 'fleet', 'drivers', 'trips', 'maintenance', 'fuel', 'expenses', 'reports'
  ],
  [ROLES.DISPATCHER]: [
    'dashboard', 'fleet', 'drivers', 'trips', 'maintenance'
  ],
  [ROLES.SAFETY_OFFICER]: [
    'dashboard', 'drivers', 'compliance'
  ],
  [ROLES.FINANCIAL_ANALYST]: [
    'dashboard', 'expenses', 'reports'
  ],
  [ROLES.DRIVER]: [
    'fuel'
  ]
};

/**
 * Route to permission module mapping
 * Used by requireRole() middleware for module-based access control
 */
const ROUTE_MODULE_MAP = {
  '/api/v1/dashboard': 'dashboard',
  '/api/v1/vehicles': 'fleet',
  '/api/v1/drivers': 'drivers',
  '/api/v1/trips': 'trips',
  '/api/v1/maintenance': 'maintenance',
  '/api/v1/fuel': 'fuel',
  '/api/v1/expenses': 'expenses',
  '/api/v1/reports': 'reports',
  '/api/v1/users': 'users'
};

module.exports = {
  VEHICLE_STATUS,
  DRIVER_STATUS,
  TRIP_STATUS,
  MAINTENANCE_STATUS,
  EXPENSE_CATEGORY,
  ROLES,
  ROLE_PERMISSIONS,
  ROUTE_MODULE_MAP
};