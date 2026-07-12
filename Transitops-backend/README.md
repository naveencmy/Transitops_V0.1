# TransitOps Backend API

**Smart Transport Operations Platform** — Enterprise-grade fleet management backend built with Node.js, Express, and PostgreSQL.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Run database schema
psql $DATABASE_URL -f scripts/01_schema.sql

# 4. Seed sample data
npm run seed

# 5. Start development server
npm run dev

# 6. Run tests
npm test
```

##  API Documentation

### Authentication
All routes except `/api/v1/auth/login` and `/api/v1/health` require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

| Endpoint | Method | Auth | Roles | Description |
|----------|--------|------|-------|-------------|
| `/api/v1/auth/login` | POST | No | All | Login with email/password |
| `/api/v1/auth/profile` | GET | Yes | All | Get current user profile |

### Vehicles
| Endpoint | Method | Roles | Description |
|----------|--------|-------|-------------|
| `/api/v1/vehicles` | GET | FleetManager, Admin | List all vehicles |
| `/api/v1/vehicles` | POST | FleetManager, Admin | Create new vehicle |
| `/api/v1/vehicles/:id` | GET | FleetManager, Admin | Get vehicle details |
| `/api/v1/vehicles/:id` | PUT | FleetManager, Admin | Update vehicle |
| `/api/v1/vehicles/:id` | DELETE | FleetManager, Admin | Delete vehicle |

### Drivers
| Endpoint | Method | Roles | Description |
|----------|--------|-------|-------------|
| `/api/v1/drivers` | GET | SafetyOfficer, FleetManager, Admin | List all drivers |
| `/api/v1/drivers` | POST | SafetyOfficer, FleetManager, Admin | Create new driver |
| `/api/v1/drivers/:id` | GET | SafetyOfficer, FleetManager, Admin | Get driver details |

### Trips
| Endpoint | Method | Roles | Description |
|----------|--------|-------|-------------|
| `/api/v1/trips` | GET | Dispatcher, FleetManager, Admin | List all trips |
| `/api/v1/trips` | POST | Dispatcher, FleetManager, Admin | Create new trip |
| `/api/v1/trips/:id/dispatch` | POST | Dispatcher, FleetManager, Admin | Dispatch trip |
| `/api/v1/trips/:id/complete` | POST | Dispatcher, FleetManager, Admin | Complete trip |
| `/api/v1/trips/:id/cancel` | POST | Dispatcher, FleetManager, Admin | Cancel trip |

### Maintenance
| Endpoint | Method | Roles | Description |
|----------|--------|-------|-------------|
| `/api/v1/maintenance` | GET | FleetManager, Admin | List maintenance records |
| `/api/v1/maintenance` | POST | FleetManager, Admin | Create maintenance |
| `/api/v1/maintenance/:id/close` | POST | FleetManager, Admin | Close maintenance |

### Fuel & Expenses
| Endpoint | Method | Roles | Description |
|----------|--------|-------|-------------|
| `/api/v1/fuel/fuel` | GET | FleetManager, Driver, Admin | List fuel logs |
| `/api/v1/fuel/fuel` | POST | FleetManager, Driver, Admin | Add fuel log |
| `/api/v1/expenses/expenses` | GET | FleetManager, FinancialAnalyst, Admin | List expenses |
| `/api/v1/expenses/expenses` | POST | FleetManager, FinancialAnalyst, Admin | Add expense |

### Dashboard & Reports
| Endpoint | Method | Roles | Description |
|----------|--------|-------|-------------|
| `/api/v1/dashboard/kpis` | GET | All | Get dashboard KPIs |
| `/api/v1/reports/fuel-efficiency` | GET | All | Fuel efficiency report |
| `/api/v1/reports/operational-cost` | GET | All | Operational cost report |
| `/api/v1/reports/vehicle-roi` | GET | All | Vehicle ROI report |

## Login Credentials (Seed Data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fleetco.com | admin123 |
| Fleet Manager | fleet@fleetco.com | fleet123 |
| Dispatcher | dispatch@fleetco.com | dispatch123 |
| Safety Officer | safety@fleetco.com | safety123 |
| Financial Analyst | finance@fleetco.com | finance123 |

##  Business Rules Enforced

All rules are enforced at the API level in the Service layer:

| # | Rule | Status |
|---|------|--------|
| 1 | Registration number must be unique | ✅ |
| 2 | License number must be unique | ✅ |
| 3 | Trip code auto-generated (TRP-XXXX) | ✅ |
| 4 | Retired/InShop vehicles blocked from dispatch | ✅ |
| 5 | Expired license drivers blocked | ✅ |
| 6 | Suspended drivers blocked | ✅ |
| 7 | OnTrip mutual exclusion (vehicle + driver) | ✅ |
| 8 | Cargo weight ≤ vehicle capacity | ✅ |
| 9 | Dispatch: atomic vehicle+driver → OnTrip | ✅ |
| 10 | Complete: atomic vehicle+driver → Available | ✅ |
| 11 | Cancel: restore vehicle/driver if dispatched | ✅ |
| 12 | Maintenance: vehicle must NOT be OnTrip | ✅ |
| 13 | Close maintenance: restore to Available | ✅ |
| 14 | Only Draft → Dispatched | ✅ |
| 15 | Only Dispatched → Completed | ✅ |
| 16 | Only Draft/Dispatched → Cancelled | ✅ |

## Architecture

```
HTTP Request
    ↓
Router (src/routes/) — validates params, calls controller
    ↓
Controller (src/controllers/) — parses request, calls service
    ↓
Service (src/services/) — enforces business rules, calls repository
    ↓
Repository (src/repositories/) — executes SQL, returns raw data
    ↓
PostgreSQL
```

##  Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

##  Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20.x |
| Framework | Express.js 4.x |
| Database | PostgreSQL 15.x |
| Auth | JWT + bcryptjs |
| Validation | Joi 17.x |
| Testing | Jest 29.x |

##  Environment Variables

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/transitops
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
```

##  License

MIT License — Built for the TransitOps Hackathon.
