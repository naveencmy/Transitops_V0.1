require('dotenv').config();
const { query } = require('../src/config/database');
const bcrypt = require('bcryptjs');

const BCRYPT_ROUNDS = 12;

async function seed() {
  console.log(' Starting database seed...\\n');

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
    console.log(`    ${rolesResult.rows.length} roles created`);

    console.log('\\n Seeding users...');

    const users = [
      { email: 'admin@tnfleet.in', password: 'admin123', name: 'Arumugam Pillai', phone: '+91 98432 10001', role: 'Admin' },
      { email: 'fleet@tnfleet.in', password: 'fleet123', name: 'Lakshmi Narayanan', phone: '+91 98432 10002', role: 'FleetManager' },
      { email: 'dispatch@tnfleet.in', password: 'dispatch123', name: 'Karthikeyan Subramanian', phone: '+91 98432 10003', role: 'Dispatcher' },
      { email: 'safety@tnfleet.in', password: 'safety123', name: 'Meenakshi Sundaram', phone: '+91 98432 10004', role: 'SafetyOfficer' },
      { email: 'finance@tnfleet.in', password: 'finance123', name: 'Venkatesh Iyer', phone: '+91 98432 10005', role: 'FinancialAnalyst' }
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
    console.log(`    ${users.length} users created`);

    console.log('\\n Seeding vehicles...');

    const vehicles = [
      { reg: 'TN-01-AB-7782', name: 'Ashok Leyland 3118', model: '3118 XL', type: 'Truck', capacity: 12000, odo: 145230, cost: 2850000, fuel: 78, status: 'Available' },
      { reg: 'TN-01-AB-7783', name: 'BharatBenz 2523R', model: '2523R', type: 'Truck', capacity: 18000, odo: 98450, cost: 3200000, fuel: 45, status: 'Available' },
      { reg: 'TN-01-AB-7784', name: 'Tata Prima 5530', model: 'Prima 5530.S', type: 'Truck', capacity: 15000, odo: 210800, cost: 2650000, fuel: 90, status: 'InShop' },
      { reg: 'TN-01-AB-7785', name: 'Mahindra Supro Maxitruck', model: 'Supro Maxitruck', type: 'Van', capacity: 3500, odo: 54300, cost: 650000, fuel: 62, status: 'Available' },
      { reg: 'TN-01-AB-7786', name: 'Eicher Pro 6035', model: 'Pro 6035', type: 'Truck', capacity: 16000, odo: 178900, cost: 2900000, fuel: 30, status: 'Available' },
      { reg: 'TN-01-AB-7787', name: 'Ashok Leyland 4825', model: '4825 Tipper', type: 'Truck', capacity: 14000, odo: 67200, cost: 2750000, fuel: 85, status: 'Available' },
      { reg: 'TN-01-AB-7788', name: 'Force Traveller 4020', model: 'Traveller 4020', type: 'Van', capacity: 3000, odo: 32100, cost: 1800000, fuel: 55, status: 'Available' }
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

    console.log('\\n Seeding drivers...');

    const drivers = [
      { name: 'Murugan Thangaraj', license: 'TN-CDL-A-99201', category: 'Heavy Goods Vehicle', expiry: '2027-08-15', phone: '+91 98432 10101', score: 4.8, trips: 342, status: 'Available', vehicle: 'TN-01-AB-7782' },
      { name: 'Saroja Devi', license: 'TN-CDL-A-99202', category: 'Heavy Goods Vehicle', expiry: '2026-11-02', phone: '+91 98432 10102', score: 4.9, trips: 410, status: 'Available', vehicle: 'TN-01-AB-7783' },
      { name: 'Palanisamy Gounder', license: 'TN-CDL-B-99203', category: 'Light Goods Vehicle', expiry: '2027-06-10', phone: '+91 98432 10103', score: 4.6, trips: 198, status: 'OffDuty', vehicle: 'TN-01-AB-7785' },
      { name: 'Kavitha Rajendran', license: 'TN-CDL-A-99204', category: 'Heavy Goods Vehicle', expiry: '2026-09-30', phone: '+91 98432 10104', score: 4.7, trips: 275, status: 'Available', vehicle: 'TN-01-AB-7787' },
      { name: 'Ramesh Kuppusamy', license: 'TN-CDL-B-99205', category: 'Light Goods Vehicle', expiry: '2028-01-20', phone: '+91 98432 10105', score: 4.5, trips: 156, status: 'OffDuty', vehicle: 'TN-01-AB-7788' },
      { name: 'Lakshmi Priya', license: 'TN-CDL-A-99206', category: 'Heavy Goods Vehicle', expiry: '2027-03-14', phone: '+91 98432 10106', score: 4.9, trips: 389, status: 'Available', vehicle: null }
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
          d.name.toLowerCase().replace(' ', '.') + '@tnfleet.in', 
          d.score, d.trips, vehicleId, d.status]);
    }
    console.log(`    ${drivers.length} drivers created`);

    console.log('\\n Seeding sample trips...');

    const trips = [
      { code: 'T-1001', source: 'Chennai, TN', dest: 'Bangalore, KA', vehicle: 'TN-01-AB-7782', driver: 'Murugan Thangaraj', cargo: 10000, distance: 350, revenue: 28500, status: 'InProgress', departure: '2026-07-12 06:00:00' },
      { code: 'T-1002', source: 'Coimbatore, TN', dest: 'Kochi, KL', vehicle: 'TN-01-AB-7783', driver: 'Saroja Devi', cargo: 8000, distance: 190, revenue: 18500, status: 'Dispatched', departure: '2026-07-12 08:00:00' },
      { code: 'T-1003', source: 'Madurai, TN', dest: 'Trichy, TN', vehicle: 'TN-01-AB-7787', driver: 'Kavitha Rajendran', cargo: 5000, distance: 135, revenue: 9500, status: 'Completed', departure: '2026-07-11 09:00:00' },
      { code: 'T-1004', source: 'Chennai, TN', dest: 'Salem, TN', vehicle: 'TN-01-AB-7786', driver: 'Lakshmi Priya', cargo: 12000, distance: 340, revenue: 32000, status: 'Draft', departure: '2026-07-13 07:00:00' },
      { code: 'T-1005', source: 'Tiruppur, TN', dest: 'Hyderabad, TS', vehicle: 'TN-01-AB-7782', driver: 'Murugan Thangaraj', cargo: 9000, distance: 890, revenue: 52000, status: 'Delayed', departure: '2026-07-10 05:00:00' },
      { code: 'T-1006', source: 'Salem, TN', dest: 'Visakhapatnam, AP', vehicle: 'TN-01-AB-7783', driver: 'Saroja Devi', cargo: 14000, distance: 1050, revenue: 68000, status: 'Dispatched', departure: '2026-07-12 04:00:00' }
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
    console.log(`    ${trips.length} trips created`);

    console.log('\\n Seeding maintenance records...');

    const maintenance = [
      { vehicle: 'TN-01-AB-7784', type: 'Engine Repair', desc: 'Turbo unit ordered from Ashok Leyland, awaiting delivery', cost: 95000, status: 'InProgress', mechanic: 'Sundar Motors', date: '2026-07-08' },
      { vehicle: 'TN-01-AB-7782', type: 'Oil Change', desc: 'Next service at 150k km', cost: 8500, status: 'Scheduled', mechanic: 'TVS Auto', date: '2026-07-20' },
      { vehicle: 'TN-01-AB-7786', type: 'Brake Service', desc: 'Overdue - schedule immediately', cost: 25000, status: 'Overdue', mechanic: 'Sundar Motors', date: '2026-07-01' },
      { vehicle: 'TN-01-AB-7783', type: 'Tire Rotation', desc: 'All tires in good condition', cost: 12000, status: 'Completed', mechanic: 'TVS Auto', date: '2026-06-28' }
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
    console.log(`   ${maintenance.length} maintenance records created`);

    console.log('\\n Seeding expenses...');

    const expenses = [
      { date: '2026-07-10', category: 'Fuel', desc: 'Diesel refill - TN-01-AB-7782', vehicle: 'TN-01-AB-7782', amount: 6800 },
      { date: '2026-07-09', category: 'Maintenance', desc: 'Oil change - TN-01-AB-7783', vehicle: 'TN-01-AB-7783', amount: 8500 },
      { date: '2026-07-08', category: 'Fuel', desc: 'Diesel refill - TN-01-AB-7783', vehicle: 'TN-01-AB-7783', amount: 7200 },
      { date: '2026-07-07', category: 'Tolls', desc: 'Chennai-Bangalore tolls - T-1001', vehicle: 'TN-01-AB-7782', amount: 850 },
      { date: '2026-07-06', category: 'Maintenance', desc: 'Brake service - TN-01-AB-7786', vehicle: 'TN-01-AB-7786', amount: 25000 },
      { date: '2026-07-05', category: 'Insurance', desc: 'Monthly fleet insurance (United India)', vehicle: null, amount: 24000 },
      { date: '2026-07-04', category: 'Fuel', desc: 'Diesel refill - TN-01-AB-7787', vehicle: 'TN-01-AB-7787', amount: 5400 },
      { date: '2026-07-03', category: 'Other', desc: 'Driver training program - RTO Chennai', vehicle: null, amount: 12000 }
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
    console.log(`   ${expenses.length} expenses created`);


    console.log('\\n Seeding fuel logs...');

    const fuelLogs = [
      { date: '2026-07-10', vehicle: 'TN-01-AB-7782', liters: 180, cost: 98.50, total: 17730.00, odo: 145230, station: 'Indian Oil - Guindy' },
      { date: '2026-07-09', vehicle: 'TN-01-AB-7783', liters: 220, cost: 99.20, total: 21824.00, odo: 98450, station: 'Bharat Petroleum - Avinashi' },
      { date: '2026-07-08', vehicle: 'TN-01-AB-7787', liters: 150, cost: 98.80, total: 14820.00, odo: 67200, station: 'HPCL - Salem Bypass' },
      { date: '2026-07-07', vehicle: 'TN-01-AB-7789', liters: 200, cost: 99.50, total: 19900.00, odo: 112400, station: 'Indian Oil - Guindy' },
      { date: '2026-07-05', vehicle: 'TN-01-AB-7785', liters: 65, cost: 100.20, total: 6513.00, odo: 54300, station: 'Bharat Petroleum - Avinashi' }
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
    console.log(`   ${fuelLogs.length} fuel logs created`);

    console.log('\\nSeed completed successfully!');
    console.log('\\nLogin Credentials:');
    console.log('  Admin:          admin@tnfleet.in / admin123');
    console.log('  Fleet Manager:  fleet@tnfleet.in / fleet123');
    console.log('  Dispatcher:     dispatch@tnfleet.in / dispatch123');
    console.log('  Safety Officer: safety@tnfleet.in / safety123');
    console.log('  Financial:      finance@tnfleet.in / finance123');

  } catch (err) {
    console.error('\\nSeed failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();