/**
 * Comprehensive RBAC Test Script
 * Tests every role against every endpoint to verify access control
 * 
 * Usage: node scripts/test-rbac.js
 */

const http = require('http');

const BASE = 'http://localhost:3000/api/v1';

const CREDENTIALS = {
  Admin: { email: 'admin@fleetco.com', password: 'admin123' },
  FleetManager: { email: 'fleet@fleetco.com', password: 'fleet123' },
  Dispatcher: { email: 'dispatch@fleetco.com', password: 'dispatch123' },
  SafetyOfficer: { email: 'safety@fleetco.com', password: 'safety123' },
  FinancialAnalyst: { email: 'finance@fleetco.com', password: 'finance123' },
};

// All endpoints to test: [method, path, description]
const ENDPOINTS = [
  // Dashboard
  ['GET', '/dashboard/kpis', 'Dashboard KPIs'],

  // Vehicles
  ['GET', '/vehicles', 'Vehicles list'],
  ['POST', '/vehicles', 'Vehicles create'],
  ['PUT', '/vehicles/1', 'Vehicles update'],
  ['DELETE', '/vehicles/1', 'Vehicles delete'],

  // Drivers
  ['GET', '/drivers', 'Drivers list'],
  ['POST', '/drivers', 'Drivers create'],
  ['PUT', '/drivers/1', 'Drivers update'],
  ['DELETE', '/drivers/1', 'Drivers delete'],

  // Trips
  ['GET', '/trips', 'Trips list'],
  ['POST', '/trips', 'Trips create'],
  ['PUT', '/trips/1', 'Trips update'],
  ['DELETE', '/trips/1', 'Trips delete'],

  // Maintenance
  ['GET', '/maintenance', 'Maintenance list'],
  ['POST', '/maintenance', 'Maintenance create'],
  ['PUT', '/maintenance/1', 'Maintenance update'],
  ['DELETE', '/maintenance/1', 'Maintenance delete'],

  // Fuel
  ['GET', '/fuel/logs', 'Fuel logs list'],
  ['POST', '/fuel/logs', 'Fuel logs create'],

  // Expenses
  ['GET', '/expenses', 'Expenses list'],
  ['POST', '/expenses', 'Expenses create'],

  // Reports
  ['GET', '/reports/fuel-efficiency', 'Reports fuel-efficiency'],
  ['GET', '/reports/operational-cost', 'Reports operational-cost'],
  ['GET', '/reports/vehicle-roi', 'Reports vehicle-roi'],
  ['GET', '/reports/fleet-utilization', 'Reports fleet-utilization'],
  ['GET', '/reports/trip-status', 'Reports trip-status'],
  ['GET', '/reports/revenue-expense', 'Reports revenue-expense'],

  // Users
  ['GET', '/users', 'Users list'],
];

// Expected access: which roles SHOULD get 200 (or non-403) for each endpoint
const EXPECTED_ACCESS = {
  'GET /dashboard/kpis':        ['Admin', 'FleetManager', 'Dispatcher', 'SafetyOfficer', 'FinancialAnalyst'],
  'GET /vehicles':              ['Admin', 'FleetManager', 'Dispatcher', 'FinancialAnalyst'],
  'POST /vehicles':             ['Admin', 'FleetManager'],
  'PUT /vehicles/1':            ['Admin', 'FleetManager'],
  'DELETE /vehicles/1':         ['Admin', 'FleetManager'],
  'GET /drivers':               ['Admin', 'FleetManager', 'Dispatcher', 'SafetyOfficer'],
  'POST /drivers':              ['Admin', 'FleetManager', 'SafetyOfficer'],
  'PUT /drivers/1':             ['Admin', 'FleetManager', 'SafetyOfficer'],
  'DELETE /drivers/1':          ['Admin', 'FleetManager', 'SafetyOfficer'],
  'GET /trips':                 ['Admin', 'FleetManager', 'Dispatcher'],
  'POST /trips':                ['Admin', 'FleetManager', 'Dispatcher'],
  'PUT /trips/1':               ['Admin', 'FleetManager', 'Dispatcher'],
  'DELETE /trips/1':            ['Admin', 'FleetManager', 'Dispatcher'],
  'GET /maintenance':           ['Admin', 'FleetManager', 'Dispatcher'],
  'POST /maintenance':          ['Admin', 'FleetManager'],
  'PUT /maintenance/1':         ['Admin', 'FleetManager'],
  'DELETE /maintenance/1':      ['Admin', 'FleetManager'],
  'GET /fuel/logs':             ['Admin', 'FleetManager', 'FinancialAnalyst', 'Driver'],
  'POST /fuel/logs':            ['Admin', 'FleetManager', 'Driver'],
  'GET /expenses':              ['Admin', 'FleetManager', 'FinancialAnalyst'],
  'POST /expenses':             ['Admin', 'FleetManager', 'FinancialAnalyst'],
  'GET /reports/fuel-efficiency':  ['Admin', 'FleetManager', 'FinancialAnalyst'],
  'GET /reports/operational-cost': ['Admin', 'FleetManager', 'FinancialAnalyst'],
  'GET /reports/vehicle-roi':      ['Admin', 'FleetManager', 'FinancialAnalyst'],
  'GET /reports/fleet-utilization': ['Admin', 'FleetManager', 'FinancialAnalyst'],
  'GET /reports/trip-status':      ['Admin', 'FleetManager', 'FinancialAnalyst'],
  'GET /reports/revenue-expense':  ['Admin', 'FleetManager', 'FinancialAnalyst'],
  'GET /users':                 ['Admin'],
};

function makeRequest(method, path, token, body) {
  return new Promise((resolve) => {
    const fullPath = '/api/v1' + path;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: fullPath,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => resolve({ status: 0, body: err.message }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function login(role) {
  const cred = CREDENTIALS[role];
  if (!cred) return null;
  const res = await makeRequest('POST', '/auth/login', null, cred);
  if (res.status === 200 && res.body?.data?.token) {
    return res.body.data.token;
  }
  console.log(`  ⚠️  Login failed for ${role}: ${res.status}`);
  return null;
}

async function runTests() {
  console.log('🧪 TransitOps RBAC Test Suite\n');
  console.log('=' .repeat(80));

  const results = {};
  const failures = [];
  const passes = [];

  for (const role of Object.keys(CREDENTIALS)) {
    console.log(`\n📋 Testing role: ${role}`);
    console.log('-'.repeat(60));

    const token = await login(role);
    if (!token) {
      console.log(`  ❌ Could not authenticate. Skipping all tests for ${role}.`);
      continue;
    }
    console.log(`  ✅ Authenticated successfully`);

    results[role] = {};

    for (const [method, path, desc] of ENDPOINTS) {
      const key = `${method} ${path}`;
      const expected = EXPECTED_ACCESS[key] || [];
      const shouldHaveAccess = expected.includes(role);

      // For POST/PUT/DELETE, send minimal valid body to avoid validation errors
      let body = null;
      if (method === 'POST' && (path === '/vehicles' || path === '/drivers')) {
        body = { name: 'test', email: 'test@test.com' };
      } else if (method === 'POST' && path === '/trips') {
        body = { origin: 'A', destination: 'B', vehicleId: 1, driverId: 1 };
      } else if (method === 'POST' && path === '/maintenance') {
        body = { vehicleId: 1, type: 'Test', description: 'Test' };
      } else if (method === 'POST' && path === '/fuel/logs') {
        body = { vehicleId: 1, liters: 10, costPerLiter: 1, odometerKm: 100, station: 'Test' };
      } else if (method === 'POST' && path === '/expenses') {
        body = { category: 'Fuel', description: 'Test', amount: 10 };
      }

      const res = await makeRequest(method, path, token, body);
      const got403 = res.status === 403;
      const got200 = res.status === 200;

      let status;
      if (shouldHaveAccess && !got403) {
        status = '✅';
        passes.push({ role, desc, status: res.status });
      } else if (!shouldHaveAccess && got403) {
        status = '✅';
        passes.push({ role, desc, status: res.status });
      } else if (shouldHaveAccess && got403) {
        status = '❌ FAIL (expected access but got 403)';
        failures.push({ role, desc, status: res.status });
      } else {
        status = `⚠️  Unexpected: got ${res.status} (expected ${shouldHaveAccess ? '200' : '403'})`;
        if (!shouldHaveAccess && !got403) {
          failures.push({ role, desc, status: res.status, note: 'should be denied' });
        } else {
          failures.push({ role, desc, status: res.status });
        }
      }

      console.log(`  ${status}  ${method.padEnd(6)} ${path.padEnd(35)} ${desc}`);
    }
  }

  console.log('\n' + '=' .repeat(80));
  console.log('\n📊 SUMMARY\n');
  console.log(`  ✅ Passed: ${passes.length}`);
  console.log(`  ❌ Failed: ${failures.length}`);

  if (failures.length > 0) {
    console.log('\n❌ FAILURES:');
    for (const f of failures) {
      console.log(`  - ${f.role}: ${f.desc} (status ${f.status})${f.note ? ` - ${f.note}` : ''}`);
    }
  }

  console.log('\n✅ RBAC Matrix:');
  const roles = Object.keys(CREDENTIALS);
  const header = 'Endpoint'.padEnd(40) + roles.map(r => r.padEnd(15)).join('');
  console.log(header);
  console.log('-'.repeat(header.length));

  for (const [method, path, desc] of ENDPOINTS) {
    const key = `${method} ${path}`;
    const expected = EXPECTED_ACCESS[key] || [];
    const row = `${method} ${path}`.padEnd(40) + roles.map(r => (expected.includes(r) ? '✅' : '❌').padEnd(15)).join('');
    console.log(row);
  }

  process.exit(failures.length > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
