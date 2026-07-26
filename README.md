<a id="readme-top"></a>

<div align="center">

<!-- SHIELDS -->
<a href="https://github.com/your-org/transitops/graphs/contributors"><img src="https://img.shields.io/github/contributors/your-org/transitops?color=%2300b4d8&style=for-the-badge" alt="contributors"></a>
<a href="https://github.com/your-org/transitops/network/members"><img src="https://img.shields.io/github/forks/your-org/transitops?style=for-the-badge" alt="forks"></a>
<a href="https://github.com/your-org/transitops/stargazers"><img src="https://img.shields.io/github/stars/your-org/transitops?style=for-the-badge" alt="stars"></a>
<a href="https://github.com/your-org/transitops/issues"><img src="https://img.shields.io/github/issues/your-org/transitops?style=for-the-badge" alt="issues"></a>
<a href="https://github.com/your-org/transitops/blob/main/LICENSE"><img src="https://img.shields.io/github/license/your-org/transitops?style=for-the-badge" alt="license"></a>

<!-- LOGO & TITLE -->
<br />
<div align="center">
  <a href="https://github.com/your-org/transitops">
    <img src="https://img.icons8.com/fluency/96/truck.png" alt="Logo" width="80" height="80">
  </a>
  <h1 align="center"><b>TRANSITOPS</b></h1>
  <p align="center">
    <em>Smart Transport Operations Platform — End-to-end fleet management for modern logistics</em>
    <br />
    <br />
    <a href="#-live-demo">Live Demo</a>
    ·
    <a href="https://github.com/your-org/transitops/issues/new?labels=bug&template=bug-report.md">Report Bug</a>
    ·
    <a href="https://github.com/your-org/transitops/issues/new?labels=enhancement&template=feature-request.md">Request Feature</a>
  </p>
</div>

<!-- BADGES ROW -->
<br />

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-29.7-C21325?style=for-the-badge&logo=jest&logoColor=white)

</div>

---

<!-- TABLE OF CONTENTS -->
<details>
<summary><strong>Table of Contents</strong></summary>
<ol>
  <li><a href="#-overview">Overview</a></li>
  <li><a href="#-live-demo">Live Demo</a></li>
  <li><a href="#-features">Features</a></li>
  <li><a href="#-tech-stack--architecture">Tech Stack & Architecture</a></li>
  <li><a href="#-getting-started">Getting Started</a></li>
  <li><a href="#-configuration">Configuration</a></li>
  <li><a href="#-api-reference">API Reference</a></li>
  <li><a href="#-role-based-access-control">Role-Based Access Control</a></li>
  <li><a href="#-project-structure">Project Structure</a></li>
  <li><a href="#-roadmap">Roadmap</a></li>
  <li><a href="#-contributing">Contributing</a></li>
</ol>
</details>

---

<!-- OVERVIEW -->
## Overview

<div align="center">
  <img src="https://img.shields.io/badge/MISSION- digitizing%20fleet%20operations-0ea5e9?style=for-the-badge&labelColor=0c4a6e" alt="mission">
</div>
<br />

Many logistics companies still rely on **spreadsheets and manual logbooks** to manage transport operations, leading to scheduling conflicts, missed maintenance windows, expired driver licenses, inaccurate expense tracking, and poor fleet utilization.

**TransitOps** solves this by digitizing the **complete lifecycle** of transport operations — from vehicle registration and driver compliance to real-time dispatching, maintenance scheduling, fuel logging, and operational analytics. Built with a modern React/TypeScript frontend and Node.js/Express backend, it delivers a responsive, production-grade interface for logistics teams of any size.

> [!TIP]
> **TransitOps is free for demo traffic.** Deploy to AWS Lambda + Neon PostgreSQL + Vercel for $0/month.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- LIVE DEMO -->
## Live Demo

<div align="center">

| | |
|:---:|:---:|
| **Frontend** | `https://transitops.vercel.app` |
| **Backend API** | `https://abc123.execute-api.us-east-1.amazonaws.com/prod/api/v1` |
| **Database** | Neon PostgreSQL (free tier) |

</div>

### Demo Credentials

| Role | Email | Password | Access Level |
|:-----|:------|:---------|:-------------|
| <img src="https://img.shields.io/badge/Admin-DC2626?style=flat-square" alt="admin"> | `admin@fleetco.com` | `admin123` | Full system access |
| <img src="https://img.shields.io/badge/Fleet_Manager-2563EB?style=flat-square" alt="fleet"> | `fleet@fleetco.com` | `fleet123` | Vehicles, trips, maintenance |
| <img src="https://img.shields.io/badge/Dispatcher-7C3AED?style=flat-square" alt="dispatcher"> | `dispatch@fleetco.com` | `dispatch123` | Trip dispatch & tracking |
| <img src="https://img.shields.io/badge/Safety_Officer-059669?style=flat-square" alt="safety"> | `safety@fleetco.com` | `safety123` | Driver compliance & safety |
| <img src="https://img.shields.io/badge/Financial_Analyst-D97706?style=flat-square" alt="finance"> | `finance@fleetco.com` | `finance123` | Expenses & analytics |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- FEATURES -->
## Features

<div align="center">
  <img src="https://img.shields.io/badge/CORE_MODULES-9-blueviolet?style=for-the-badge&labelColor=581c87" alt="modules">
</div>
<br />

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>Authentication & RBAC</h3>
      <p>Secure JWT-based authentication with 5 distinct roles. Each role sees only what it needs — Admin has full access, Dispatcher manages trips, Safety Officer handles compliance, Financial Analyst tracks costs.</p>
    </td>
    <td width="50%" valign="top">
      <h3>Dashboard & KPIs</h3>
      <p>Real-time metrics: Active Vehicles, Fleet Utilization %, Fuel Efficiency, Vehicle ROI. Charts powered by Recharts with drill-down capability. Role-aware — only loads data the user can access.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>Fleet Management</h3>
      <p>Vehicle registry with plate numbers, capacity, odometer, acquisition cost, and status tracking. Vehicles move through states: Available → OnTrip → InShop → Retired — all automatic.</p>
    </td>
    <td width="50%" valign="top">
      <h3>Driver Management</h3>
      <p>Driver profiles with license tracking, safety scores, expiry alerts, and compliance status. Expired licenses are automatically blocked from trip assignment.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>Trip Dispatch</h3>
      <p>End-to-end trip lifecycle: Draft → Dispatched → Completed/Cancelled. Automatic vehicle & driver status transitions. Cargo weight validation against vehicle capacity.</p>
    </td>
    <td width="50%" valign="top">
      <h3>Maintenance Tracking</h3>
      <p>Create maintenance records that auto-set vehicle status to "In Shop" — hiding from dispatch. Close records to restore availability. Track costs, parts, and service history.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>Fuel & Expenses</h3>
      <p>Log fuel consumption per trip and operational expenses (tolls, parking, fines). Category filtering, cost aggregation, and CSV export. Separate fuel and expense tabs.</p>
    </td>
    <td width="50%" valign="top">
      <h3>Reports & Analytics</h3>
      <p>Fleet utilization trends, fuel efficiency charts, operational cost breakdown, Vehicle ROI calculation, trip status distribution. All reports exportable to CSV.</p>
    </td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <h3>Deployment Infrastructure</h3>
      <p>Production-ready: AWS Lambda + API Gateway (backend), S3 + CloudFront (frontend), Neon PostgreSQL. SAM template, Terraform, GitHub Actions CI/CD, Docker Compose for local dev.</p>
    </td>
  </tr>
</table>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- TECH STACK & ARCHITECTURE -->
## Tech Stack & Architecture

<div align="center">
  <img src="https://img.shields.io/badge/BUILT_WITH- modern%20tools-0ea5e9?style=for-the-badge&labelColor=0c4a6e" alt="built with">
</div>
<br />

### Frontend Stack

<div align="center">

| | | | |
|:---:|:---:|:---:|:---:|
| ![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white) | ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | ![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white) | ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) |
| ![React Router](https://img.shields.io/badge/React_Router-6.26-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white) | ![Recharts](https://img.shields.io/badge/Recharts-2.12-FF6B6B?style=for-the-badge) | ![Lucide](https://img.shields.io/badge/Lucide-0.40-000000?style=for-the-badge) | ![PostCSS](https://img.shields.io/badge/PostCSS-8.4-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white) |

</div>

### Backend Stack

<div align="center">

| | | | |
|:---:|:---:|:---:|:---:|
| ![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white) | ![Express](https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT-9.0-000000?style=for-the-badge) |
| ![Joi](https://img.shields.io/badge/Joi-17.13-E85D2A?style=for-the-badge) | ![Helmet](https://img.shields.io/badge/Helmet-7.1-000000?style=for-the-badge) | ![Morgan](https://img.shields.io/badge/Morgan-1.10-35495E?style=for-the-badge) | ![Jest](https://img.shields.io/badge/Jest-29.7-C21325?style=for-the-badge&logo=jest&logoColor=white) |

</div>

### Architecture

<div align="center">

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React SPA)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │Dashboard │ │  Fleet   │ │ Drivers  │ │  Trips   │ │Analytics │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ │
│       └─────────────┴────────────┴─────────────┴────────────┘       │
│                              │                                      │
│                    ┌─────────▼─────────┐                           │
│                    │   Service Layer   │                           │
│                    │   (API Client)    │                           │
│                    └─────────┬─────────┘                           │
└──────────────────────────────┼──────────────────────────────────────┘
                               │  HTTP / JSON
┌──────────────────────────────┼──────────────────────────────────────┐
│                    ┌─────────▼─────────┐                           │
│                    │   API Gateway     │                           │
│                    │ (Lambda / Express)│                           │
│                    └─────────┬─────────┘                           │
│                              │                                      │
│  ┌───────────────────────────▼───────────────────────────────────┐  │
│  │                    MIDDLEWARE PIPELINE                        │  │
│  │  ┌──────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │ Auth │→ │ RBAC     │→ │ Validate │→ │ Error Handler    │  │  │
│  │  └──────┘  └──────────┘  └──────────┘  └──────────────────┘  │  │
│  └───────────────────────────┬───────────────────────────────────┘  │
│                              │                                      │
│  ┌───────────────────────────▼───────────────────────────────────┐  │
│  │                   BUSINESS LOGIC                              │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐   │  │
│  │  │ Controller │→ │  Service   │→ │     Repository       │   │  │
│  │  │ (request)  │  │ (rules)    │  │     (queries)        │   │  │
│  │  └────────────┘  └────────────┘  └──────────┬───────────┘   │  │
│  └──────────────────────────────────────────────┼───────────────┘  │
│                                                 │                  │
│                              ┌──────────────────▼──────────────┐   │
│                              │       PostgreSQL (Neon)         │   │
│                              └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- GETTING STARTED -->
## Getting Started

<div align="center">
  <img src="https://img.shields.io/badge/QUICK_START-5_minutes-22c55e?style=for-the-badge&labelColor=166534" alt="quick start">
</div>
<br />

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white" alt="node"> | >= 20.0.0 | [nodejs.org](https://nodejs.org/) |
| <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="pg"> | 14+ | [postgresql.org](https://www.postgresql.org/) |
| <img src="https://img.shields.io/badge/npm-9+-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm"> | 9+ | Comes with Node.js |
| <img src="https://img.shields.io/badge/Git-Latest-F05032?style=flat-square&logo=git&logoColor=white" alt="git"> | Latest | [git-scm.com](https://git-scm.com/) |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/transitops.git
cd transitops

# 2. Backend setup
cd Transitops-backend
npm install
cp .env.example .env          # Edit with your DB credentials
psql $DATABASE_URL -f scripts/01_schema.sql
npm run seed
npm run dev                    # Runs on http://localhost:3000

# 3. Frontend setup (new terminal)
cd ../Transitops_frontend
npm install
npm run dev                    # Runs on http://localhost:5173
```

> [!IMPORTANT]
> The backend must be running on port 3000 before starting the frontend. The Vite dev server proxies `/api` requests to `http://localhost:3000`.

### Verify Installation

```bash
# Backend health check
curl http://localhost:3000/api/v1/health
# → {"success":true,"data":{"status":"ok","timestamp":"..."}}

# Frontend
open http://localhost:5173
# → Login page should appear
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- CONFIGURATION -->
## Configuration

<div align="center">
  <img src="https://img.shields.io/badge/ENVIRONMENT_VARIABLES-8_total-8b5cf6?style=for-the-badge&labelColor=581c87" alt="env vars">
</div>
<br />

### Backend

| Variable | Required | Default | Description |
|:---------|:--------:|:-------:|:------------|
| `DATABASE_URL` | <img src="https://img.shields.io/badge/-YES-DC2626?style=flat-square" alt="yes"> | — | PostgreSQL connection string |
| `JWT_SECRET` | <img src="https://img.shields.io/badge/-YES-DC2626?style=flat-square" alt="yes"> | — | JWT signing key (min 32 chars) |
| `PORT` | <img src="https://img.shields.io/badge/-NO-6B7280?style=flat-square" alt="no"> | `3000` | Server port |
| `NODE_ENV` | <img src="https://img.shields.io/badge/-NO-6B7280?style=flat-square" alt="no"> | `development` | Environment mode |
| `JWT_EXPIRES_IN` | <img src="https://img.shields.io/badge/-NO-6B7280?style=flat-square" alt="no"> | `24h` | Token expiration |
| `BCRYPT_ROUNDS` | <img src="https://img.shields.io/badge/-NO-6B7280?style=flat-square" alt="no"> | `12` | Password hash rounds |
| `ALLOWED_ORIGINS` | <img src="https://img.shields.io/badge/-NO-6B7280?style=flat-square" alt="no"> | `localhost:5173,5174` | CORS origins |

### Frontend

| Variable | Required | Default | Description |
|:---------|:--------:|:-------:|:------------|
| `VITE_API_BASE_URL` | <img src="https://img.shields.io/badge/-NO-6B7280?style=flat-square" alt="no"> | `/api` | Backend URL for production |

> [!NOTE]
> In development, the Vite proxy handles `/api` routing automatically. `VITE_API_BASE_URL` only needs to be set for production deployments (Vercel, Netlify, etc.).

### Quick Config

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Backend .env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/transitops_db
JWT_SECRET=paste_generated_secret_here
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
ALLOWED_ORIGINS=http://localhost:5173
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- API REFERENCE -->
## API Reference

<div align="center">
  <img src="https://img.shields.io/badge/REST_API-20_endpoints-0ea5e9?style=for-the-badge&labelColor=0c4a6e" alt="api">
</div>
<br />

> [!NOTE]
> All routes except `/auth/login` and `/health` require a JWT token: `Authorization: Bearer <token>`

### Authentication

| Method | Endpoint | Auth | Roles | Description |
|:------:|:---------|:----:|:------|:------------|
| `POST` | `/api/v1/auth/login` | No | All | Login with email/password |
| `GET` | `/api/v1/auth/profile` | Yes | All | Get current user profile |

### Vehicles

| Method | Endpoint | Roles | Description |
|:------:|:---------|:------|:------------|
| `GET` | `/api/v1/vehicles` | FleetManager, Dispatcher, FinancialAnalyst, Admin | List all vehicles |
| `POST` | `/api/v1/vehicles` | FleetManager, Admin | Create new vehicle |
| `GET` | `/api/v1/vehicles/:id` | FleetManager, Dispatcher, Admin | Get vehicle details |
| `PUT` | `/api/v1/vehicles/:id` | FleetManager, Admin | Update vehicle |
| `DELETE` | `/api/v1/vehicles/:id` | FleetManager, Admin | Delete vehicle |

### Drivers

| Method | Endpoint | Roles | Description |
|:------:|:---------|:------|:------------|
| `GET` | `/api/v1/drivers` | Dispatcher, SafetyOfficer, FleetManager, Admin | List all drivers |
| `POST` | `/api/v1/drivers` | SafetyOfficer, FleetManager, Admin | Create new driver |
| `GET` | `/api/v1/drivers/:id` | Dispatcher, SafetyOfficer, FleetManager, Admin | Get driver details |

### Trips

| Method | Endpoint | Roles | Description |
|:------:|:---------|:------|:------------|
| `GET` | `/api/v1/trips` | Dispatcher, FleetManager, Admin | List all trips |
| `POST` | `/api/v1/trips` | Dispatcher, FleetManager, Admin | Create new trip |
| `POST` | `/api/v1/trips/:id/dispatch` | Dispatcher, FleetManager, Admin | Dispatch trip |
| `POST` | `/api/v1/trips/:id/complete` | Dispatcher, FleetManager, Admin | Complete trip |
| `POST` | `/api/v1/trips/:id/cancel` | Dispatcher, FleetManager, Admin | Cancel trip |

### Maintenance

| Method | Endpoint | Roles | Description |
|:------:|:---------|:------|:------------|
| `GET` | `/api/v1/maintenance` | Dispatcher, FleetManager, Admin | List maintenance records |
| `POST` | `/api/v1/maintenance` | FleetManager, Admin | Create maintenance record |
| `PUT` | `/api/v1/maintenance/:id` | FleetManager, Admin | Update maintenance |
| `POST` | `/api/v1/maintenance/:id/close` | FleetManager, Admin | Close & complete |

### Fuel & Expenses

| Method | Endpoint | Roles | Description |
|:------:|:---------|:------|:------------|
| `GET` | `/api/v1/fuel/logs` | Admin, FleetManager, FinancialAnalyst | List fuel logs |
| `POST` | `/api/v1/fuel/logs` | Admin, FleetManager, Driver | Add fuel log |
| `GET` | `/api/v1/expenses` | Admin, FleetManager, FinancialAnalyst | List expenses |
| `POST` | `/api/v1/expenses` | Admin, FleetManager, FinancialAnalyst | Add expense |

### Dashboard & Reports

| Method | Endpoint | Roles | Description |
|:------:|:---------|:------|:------------|
| `GET` | `/api/v1/dashboard/kpis` | All authenticated | Dashboard KPIs |
| `GET` | `/api/v1/reports/fuel-efficiency` | All authenticated | Fuel efficiency report |
| `GET` | `/api/v1/reports/operational-cost` | All authenticated | Operational cost report |
| `GET` | `/api/v1/reports/vehicle-roi` | All authenticated | Vehicle ROI report |
| `GET` | `/api/v1/reports/revenue-expense` | All authenticated | Revenue vs expense |
| `GET` | `/api/v1/reports/trip-status` | All authenticated | Trip status distribution |

### Users (Admin Only)

| Method | Endpoint | Roles | Description |
|:------:|:---------|:------|:------------|
| `GET` | `/api/v1/users` | Admin | List all users |
| `POST` | `/api/v1/users` | Admin | Create new user |
| `PUT` | `/api/v1/users/:id` | Admin | Update user |
| `DELETE` | `/api/v1/users/:id` | Admin | Delete user |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- RBAC -->
## Role-Based Access Control

<div align="center">
  <img src="https://img.shields.io/badge/5_ROLES- granular%20permissions-8b5cf6?style=for-the-badge&labelColor=581c87" alt="rbac">
</div>
<br />

| | Admin | Fleet Manager | Dispatcher | Safety Officer | Financial Analyst |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Dashboard** | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> |
| **Vehicle CRUD** | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Read-3b82f6?style=flat-square" alt="read"> | <img src="https://img.shields.io/badge/-Read-3b82f6?style=flat-square" alt="read"> | <img src="https://img.shields.io/badge/-Read-3b82f6?style=flat-square" alt="read"> |
| **Driver CRUD** | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Read-3b82f6?style=flat-square" alt="read"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-None-6b7280?style=flat-square" alt="none"> |
| **Trip Management** | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-None-6b7280?style=flat-square" alt="none"> | <img src="https://img.shields.io/badge/-None-6b7280?style=flat-square" alt="none"> |
| **Maintenance** | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Read-3b82f6?style=flat-square" alt="read"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Read-3b82f6?style=flat-square" alt="read"> |
| **Fuel & Expenses** | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-None-6b7280?style=flat-square" alt="none"> | <img src="https://img.shields.io/badge/-None-6b7280?style=flat-square" alt="none"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> |
| **Analytics** | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Read-3b82f6?style=flat-square" alt="read"> | <img src="https://img.shields.io/badge/-Read-3b82f6?style=flat-square" alt="read"> | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> |
| **Settings / Users** | <img src="https://img.shields.io/badge/-Full-22c55e?style=flat-square" alt="full"> | <img src="https://img.shields.io/badge/-Read-3b82f6?style=flat-square" alt="read"> | <img src="https://img.shields.io/badge/-None-6b7280?style=flat-square" alt="none"> | <img src="https://img.shields.io/badge/-None-6b7280?style=flat-square" alt="none"> | <img src="https://img.shields.io/badge/-None-6b7280?style=flat-square" alt="none"> |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- PROJECT STRUCTURE -->
## Project Structure

```
transitops/
├── Transitops-backend/                # Node.js Express API
│   ├── src/
│   │   ├── config/                    # Environment configuration
│   │   ├── controllers/               # Request handlers (9 controllers)
│   │   ├── middleware/                 # Auth, RBAC, validation, errors
│   │   ├── repositories/              # PostgreSQL queries (6 repos)
│   │   ├── routes/                    # API routes (11 route files)
│   │   ├── services/                  # Business logic layer
│   │   ├── utils/                     # Helpers & utilities
│   │   ├── validators/                # Joi schemas (6 schema files)
│   │   └── app.js                     # Express app entry point
│   ├── scripts/                       # Seed & migration scripts
│   ├── tests/                         # Jest test suites
│   ├── Dockerfile                     # Backend container
│   └── package.json
│
├── Transitops_frontend/               # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/                # Sidebar, Header
│   │   │   └── ui/                    # Reusable primitives
│   │   ├── config/                    # Role permissions
│   │   ├── pages/                     # Route components (11 pages)
│   │   ├── services/                  # API client functions (15+ services)
│   │   ├── types/                     # TypeScript interfaces
│   │   ├── App.tsx                    # Router setup
│   │   └── main.tsx                   # Entry point
│   ├── Dockerfile                     # Frontend container (nginx)
│   ├── vite.config.ts
│   └── package.json
│
├── transitops-forward-eng/            # Deployment infrastructure
│   ├── infrastructure/
│   │   ├── sam/                       # AWS SAM (Lambda + API Gateway)
│   │   └── terraform/                 # Terraform (S3 + CloudFront)
│   ├── scripts/                       # Deploy, seed, demo-reset
│   ├── backend/                       # Lambda handler
│   ├── docker-compose.yml             # Local dev stack
│   └── .github/workflows/deploy.yml   # CI/CD pipeline
│
└── README.md
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- ROADMAP -->
## Roadmap

<div align="center">

| Phase | Feature | Status |
|:-----:|:--------|:------:|
| **MVP** | Authentication, Vehicles, Drivers, Trips, Maintenance | <img src="https://img.shields.io/badge/DONE-22c55e?style=for-the-badge" alt="done"> |
| **v1.1** | Fuel & Expense tracking, Dashboard KPIs | <img src="https://img.shields.io/badge/DONE-22c55e?style=for-the-badge" alt="done"> |
| **v1.2** | Reports with CSV/PDF export | <img src="https://img.shields.io/badge/DONE-22c55e?style=for-the-badge" alt="done"> |
| **v1.3** | Charts & visual analytics | <img src="https://img.shields.io/badge/DONE-22c55e?style=for-the-badge" alt="done"> |
| **v1.4** | Role-based dashboard & RBAC | <img src="https://img.shields.io/badge/DONE-22c55e?style=for-the-badge" alt="done"> |
| **v1.5** | Production deployment (Lambda + Vercel) | <img src="https://img.shields.io/badge/DONE-22c55e?style=for-the-badge" alt="done"> |
| **v1.6** | Email reminders for expiring licenses | <img src="https://img.shields.io/badge/PLANNED-6b7280?style=for-the-badge" alt="planned"> |
| **v1.7** | Vehicle document management | <img src="https://img.shields.io/badge/PLANNED-6b7280?style=for-the-badge" alt="planned"> |
| **v2.0** | GPS tracking integration | <img src="https://img.shields.io/badge/PLANNED-6b7280?style=for-the-badge" alt="planned"> |
| **v2.1** | Mobile app (React Native) | <img src="https://img.shields.io/badge/PLANNED-6b7280?style=for-the-badge" alt="planned"> |

</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- CONTRIBUTING -->
## Contributing

<div align="center">
  <img src="https://img.shields.io/badge/WELCOME- contributions-8b5cf6?style=for-the-badge&labelColor=581c87" alt="contributing">
</div>
<br />

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct, development workflow, and PR process.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- CONTACT & ACKNOWLEDGMENTS -->
## Acknowledgments

- [Express.js](https://expressjs.com/) — Fast, unopinionated web framework
- [React](https://reactjs.com/) — A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Recharts](https://recharts.org/) — Composable charting library
- [Lucide Icons](https://lucide.dev/) — Beautiful, consistent icons
- [Neon](https://neon.tech/) — Serverless PostgreSQL
- [Vercel](https://vercel.com/) — Frontend deployment platform
- [AWS SAM](https://aws.amazon.com/serverless/sam/) — Serverless Application Model

---

<div align="center">

**[Back to Top](#readme-top)**

Made with by the Kernel Raise Team

</div>
