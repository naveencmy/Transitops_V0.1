
require('dotenv').config();
const { query } = require('../src/config/database');
const bcrypt = require('bcryptjs');

const BCRYPT_ROUNDS = 12;

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    
    console.log('Seeding roles...');
    await query(`
      INSERT INTO roles (name, permissions) VALUES
      ('Admin', '["*"]'),
      ('FleetManager', '["dashboard", "fleet", "maintenance", "vehicles", "drivers"]'),
      ('Dispatcher', '["dashboard", "trips"]'),
      ('SafetyOfficer', '["drivers", "compliance"]'),
      ('FinancialAnalyst', '["fuel_expenses", "analytics", "reports"]'),
      ('Driver', '["trips", "fuel"]')
      ON CONFLICT (name) DO NOTHING
    `);

   
    const rolesResult = await query('SELECT id, name FROM roles');
    const roles = {};
    rolesResult.rows.forEach(r => roles[r.name] = r.id);
    console.log(`   ✓ ${rolesResult.rows.length} roles created`);

    console.log('\n👤 Seeding users...');

    const users = [
      { email: 'admin@fleetco.com', password: 'admin123', name: 'Alex Morgan', phone: '+1 713-555-0100', role: 'Admin' },
      { email: 'fleet@fleetco.com', password: 'fleet123', name: 'Sofia Chen', phone: '+1 713-555-0200', role: 'FleetManager' },
      { email: 'dispatch@fleetco.com', password: 'dispatch123', name: 'James Okafor', phone: '+1 713-555-0300', role: 'Dispatcher' },
      { email: 'safety@fleetco.com', password: 'safety123', name: 'Priya Nair', phone: '+1 713-555-0400', role: 'SafetyOfficer' },
      { email: 'finance@fleetco.com', password: 'finance123', name: 'Liam Murphy', phone: '+1 713-555-0500', role: 'FinancialAnalyst' }
    ];

    for (const user of users) {
      const hash = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
      await query(`
        INSERT INTO users (email, password_hash, full_name, phone, role_id, status)
        VALUES ($1, $2, $3, $4, $5, 'active')
        ON CONFLICT (email) DO UPDATE SET
          password_hash = EXCLUDED.password_hash,
          full_name = EXCLUDED.full_name,
          role_id = EXCLUDED.role_id
      `, [user.email, hash, user.name, user.phone, roles[user.role]]);
    }
    console.log(`   ✓ ${users.length} users created`);

    console.log('\n Seeding vehicles...');

    const vehicles = [
      { reg: 'TX-7782', name: 'Freightliner Cascadia', model: 'Cascadia', type: 'Truck', capacity: 12000, odo: 145230, cost: 85000, fuel: 78, status: 'Available' },
      { reg: 'TX-7783', name: 'Kenworth T680', model: 'T680', type: 'Truck', capacity: 18000, odo: 98450, cost: 92000, fuel: 45, status: 'Available' },
      { reg: 'TX-7784', name: 'Volvo VNL 760', model: 'VNL 760', type: 'Truck', capacity: 15000, odo: 210800, cost: 78000, fuel: 90, status: 'InShop' },
      { reg: 'TX-7785', name: 'Ford Transit 350', model: 'Transit 350', type: 'Van', capacity: 3500, odo: 54300, cost: 35000, fuel: 62, status: 'Available' },
      { reg: 'TX-7786', name: 'Peterbilt 579', model: '579', type: 'Truck', capacity: 16000, odo: 178900, cost: 88000, fuel: 30, status: 'Available' },
      { reg: 'TX-7787', name: 'International LT', model: 'LT Series', type: 'Truck', capacity: 14000, odo: 67200, cost: 75000, fuel: 85, status: 'Available' },
      { reg: 'TX-7788', name: 'Mercedes Sprinter', model: 'Sprinter', type: 'Van', capacity: 3000, odo: 32100, cost: 42000, fuel: 55, status: 'Available' }
    ];

    for (const v of vehicles) {
      await query(`
        INSERT INTO vehicles (registration_number, name, model, type, max_load_capacity_kg, odometer_km, acquisition_cost, fuel_level_pct, next_maintenance_km, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (registration_number) DO UPDATE SET
          name = EXCLUDED.name,
          model = EXCLUDED.model,
          type = EXCLUDED.type,
          max_load_capacity_kg = EXCLUDED.max_load_capacity_kg,
          odometer_km = EXCLUDED.odometer_km,
          acquisition_cost = EXCLUDED.acquisition_cost,
          fuel_level_pct = EXCLUDED.fuel_level_pct,
          status = EXCLUDED.status
      `, [v.reg, v.name, v.model, v.type, v.capacity, v.odo, v.cost, v.fuel, v.odo + 5000, v.status]);
    }
    console.log(`   ✓ ${vehicles.length} vehicles created`);

    console.log('\n Seeding drivers...');

    const drivers = [
      { name: 'Marcus Johnson', license: 'CDL-A-99201', category: 'Class A', expiry: '2027-08-15', phone: '+1 713-555-0101', score: 4.8, trips: 342, status: 'Available', vehicle: 'TX-7782' },
      { name: 'Sarah Williams', license: 'CDL-A-99202', category: 'Class A', expiry: '2026-11-02', phone: '+1 713-555-0102', score: 4.9, trips: 410, status: 'Available', vehicle: 'TX-7783' },
      { name: 'David Brown', license: 'CDL-B-99203', category: 'Class B', expiry: '2027-06-10', phone: '+1 713-555-0103', score: 4.6, trips: 198, status: 'OffDuty', vehicle: 'TX-7785' },
      { name: 'Emily Garcia', license: 'CDL-A-99204', category: 'Class A', expiry: '2026-09-30', phone: '+1 713-555-0104', score: 4.7, trips: 275, status: 'Available', vehicle: 'TX-7787' },
      { name: 'Robert Lee', license: 'CDL-B-99205', category: 'Class B', expiry: '2028-01-20', phone: '+1 713-555-0105', score: 4.5, trips: 156, status: 'OffDuty', vehicle: 'TX-7788' },
      { name: 'Jessica Martinez', license: 'CDL-A-99206', category: 'Class A', expiry: '2027-03-14', phone: '+1 713-555-0106', score: 4.9, trips: 389, status: 'Available', vehicle: null }
    ];

    for (const d of drivers) {
      // Get vehicle ID if assigned
      let vehicleId = null;
      if (d.vehicle) {
        const vResult = await query('SELECT id FROM vehicles WHERE registration_number = $1', [d.vehicle]);
        if (vResult.rows.length > 0) vehicleId = vResult.rows[0].id;
      }

      await query(`
        INSERT INTO drivers (full_name, license_number, license_category, license_expiry, contact_number, email, safety_score, total_trips, assigned_vehicle_id, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (license_number) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          license_category = EXCLUDED.license_category,
          license_expiry = EXCLUDED.license_expiry,
          contact_number = EXCLUDED.contact_number,
          safety_score = EXCLUDED.safety_score,
          total_trips = EXCLUDED.total_trips,
          assigned_vehicle_id = EXCLUDED.assigned_vehicle_id,
          status = EXCLUDED.status
      `, [d.name, d.license, d.category, d.expiry, d.phone, 
          d.name.toLowerCase().replace(' ', '.') + '@fleetco.com', 
          d.score, d.trips, vehicleId, d.status]);
    }
    console.log(`   ✓ ${drivers.length} drivers created`);

    console.log('\nSeeding sample trips...');

    const trips = [
      { code: 'T-1001', source: 'Houston, TX', dest: 'New Orleans, LA', vehicle: 'TX-7782', driver: 'Marcus Johnson', cargo: 10000, distance: 568, revenue: 4200, status: 'InProgress', departure: '2026-07-12 06:00:00' },
      { code: 'T-1002', source: 'Dallas, TX', dest: 'Oklahoma City, OK', vehicle: 'TX-7783', driver: 'Sarah Williams', cargo: 8000, distance: 322, revenue: 2800, status: 'Dispatched', departure: '2026-07-12 08:00:00' },
      { code: 'T-1003', source: 'Austin, TX', dest: 'San Antonio, TX', vehicle: 'TX-7787', driver: 'Emily Garcia', cargo: 5000, distance: 128, revenue: 1500, status: 'Completed', departure: '2026-07-11 09:00:00' },
      { code: 'T-1004', source: 'Houston, TX', dest: 'Dallas, TX', vehicle: 'TX-7786', driver: 'Jessica Martinez', cargo: 12000, distance: 385, revenue: 5100, status: 'Draft', departure: '2026-07-13 07:00:00' },
      { code: 'T-1005', source: 'Fort Worth, TX', dest: 'Little Rock, AR', vehicle: 'TX-7782', driver: 'Marcus Johnson', cargo: 9000, distance: 560, revenue: 3800, status: 'Delayed', departure: '2026-07-10 05:00:00' },
      { code: 'T-1006', source: 'San Antonio, TX', dest: 'El Paso, TX', vehicle: 'TX-7783', driver: 'Sarah Williams', cargo: 14000, distance: 880, revenue: 6200, status: 'Dispatched', departure: '2026-07-12 04:00:00' }
    ];

    for (const t of trips) {
      const vResult = await query('SELECT id FROM vehicles WHERE registration_number = $1', [t.vehicle]);
      const dResult = await query('SELECT id FROM drivers WHERE full_name = $1', [t.driver]);

      if (vResult.rows.length > 0 && dResult.rows.length > 0) {
        const vId = vResult.rows[0].id;
        const dId = dResult.rows[0].id;

        await query(`
          INSERT INTO trips (trip_code, source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, revenue, status, departure_time, dispatched_at, completed_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (trip_code) DO UPDATE SET
            status = EXCLUDED.status,
            departure_time = EXCLUDED.departure_time
        `, [t.code, t.source, t.dest, vId, dId, t.cargo, t.distance, t.revenue, t.status, 
            t.departure,
            t.status === 'Dispatched' || t.status === 'InProgress' ? t.departure : null,
            t.status === 'Completed' ? '2026-07-11 14:00:00' : null]);
      }
    }
    console.log(`   ✓ ${trips.length} trips created`);

    console.log('\n🔧 Seeding maintenance records...');

    const maintenance = [
      { vehicle: 'TX-7784', type: 'Engine Repair', desc: 'Turbo unit ordered, awaiting delivery', cost: 3200, status: 'InProgress', mechanic: 'Erik Lund', date: '2026-07-08' },
      { vehicle: 'TX-7782', type: 'Oil Change', desc: 'Next service at 150k km', cost: 280, status: 'Scheduled', mechanic: 'Auto Shop Pro', date: '2026-07-20' },
      { vehicle: 'TX-7786', type: 'Brake Service', desc: 'Overdue - schedule immediately', cost: 850, status: 'Overdue', mechanic: 'Erik Lund', date: '2026-07-01' },
      { vehicle: 'TX-7783', type: 'Tire Rotation', desc: 'All tires in good condition', cost: 420, status: 'Completed', mechanic: 'Auto Shop Pro', date: '2026-06-28' }
    ];

    for (const m of maintenance) {
      const vResult = await query('SELECT id FROM vehicles WHERE registration_number = $1', [m.vehicle]);
      if (vResult.rows.length > 0) {
        await query(`
          INSERT INTO maintenance_logs (vehicle_id, maintenance_type, description, cost, status, mechanic, scheduled_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT DO NOTHING
        `, [vResult.rows[0].id, m.type, m.desc, m.cost, m.status, m.mechanic, m.date]);
      }
    }
    console.log(`   ✓ ${maintenance.length} maintenance records created`);

    console.log('\n💰 Seeding expenses...');

    const expenses = [
      { date: '2026-07-10', category: 'Fuel', desc: 'Diesel refill - TX-7782', vehicle: 'TX-7782', amount: 680 },
      { date: '2026-07-09', category: 'Maintenance', desc: 'Oil change - TX-7783', vehicle: 'TX-7783', amount: 280 },
      { date: '2026-07-08', category: 'Fuel', desc: 'Diesel refill - TX-7783', vehicle: 'TX-7783', amount: 720 },
      { date: '2026-07-07', category: 'Tolls', desc: 'Highway tolls - T-1001', vehicle: 'TX-7782', amount: 85 },
      { date: '2026-07-06', category: 'Maintenance', desc: 'Brake service - TX-7786', vehicle: 'TX-7786', amount: 850 },
      { date: '2026-07-05', category: 'Insurance', desc: 'Monthly fleet insurance', vehicle: null, amount: 2400 },
      { date: '2026-07-04', category: 'Fuel', desc: 'Diesel refill - TX-7787', vehicle: 'TX-7787', amount: 540 },
      { date: '2026-07-03', category: 'Other', desc: 'Driver training program', vehicle: null, amount: 1200 }
    ];

    for (const e of expenses) {
      let vId = null;
      if (e.vehicle) {
        const vResult = await query('SELECT id FROM vehicles WHERE registration_number = $1', [e.vehicle]);
        if (vResult.rows.length > 0) vId = vResult.rows[0].id;
      }

      await query(`
        INSERT INTO expenses (vehicle_id, category, amount, description, created_at)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [vId, e.category, e.amount, e.desc, e.date + ' 10:00:00']);
    }
    console.log(`   ✓ ${expenses.length} expenses created`);


    console.log('\n Seeding fuel logs...');

    const fuelLogs = [
      { date: '2026-07-10', vehicle: 'TX-7782', liters: 180, cost: 1.65, total: 297.00, odo: 145230, station: 'Shell Station 12' },
      { date: '2026-07-09', vehicle: 'TX-7783', liters: 220, cost: 1.68, total: 369.60, odo: 98450, station: 'Chevron Hub 7' },
      { date: '2026-07-08', vehicle: 'TX-7787', liters: 150, cost: 1.62, total: 243.00, odo: 67200, station: 'ExpressFuel 3' },
      { date: '2026-07-07', vehicle: 'TX-7789', liters: 200, cost: 1.67, total: 334.00, odo: 112400, station: 'Shell Station 12' },
      { date: '2026-07-05', vehicle: 'TX-7785', liters: 65, cost: 1.70, total: 110.50, odo: 54300, station: 'Chevron Hub 7' }
    ];

    for (const f of fuelLogs) {
      const vResult = await query('SELECT id FROM vehicles WHERE registration_number = $1', [f.vehicle]);
      if (vResult.rows.length > 0) {
        await query(`
          INSERT INTO fuel_logs (vehicle_id, liters, cost_per_liter, total_cost, odometer_reading, station, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT DO NOTHING
        `, [vResult.rows[0].id, f.liters, f.cost, f.total, f.odo, f.station, f.date + ' 08:00:00']);
      }
    }
    console.log(`    ${fuelLogs.length} fuel logs created`);

    console.log('\n Seed completed successfully!');
    console.log('\n Login Credentials:');
    console.log('   Admin:          admin@fleetco.com / admin123');
    console.log('   Fleet Manager:  fleet@fleetco.com / fleet123');
    console.log('   Dispatcher:     dispatch@fleetco.com / dispatch123');
    console.log('   Safety Officer: safety@fleetco.com / safety123');
    console.log('   Financial:      finance@fleetco.com / finance123');

  } catch (err) {
    console.error('\nSeed failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
