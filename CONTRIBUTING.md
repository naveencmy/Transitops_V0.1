<div align="center">

# Contributing to TransitOps

![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-22c55e?style=for-the-badge)
![Issues Welcome](https://img.shields.io/badge/Issues-Welcome-3b82f6?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-8b5cf6?style=for-the-badge)

**Thank you for your interest in contributing to TransitOps!**

This guide covers everything you need to get started — from setting up your development environment to submitting your first pull request.

</div>

---

## Table of Contents

<details>
<summary><strong>Quick Navigation</strong></summary>

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Project Architecture](#project-architecture)
- [Adding a New Feature](#adding-a-new-feature)

</details>

---

## Code of Conduct

<div align="center">
  <img src="https://img.shields.io/badge/BE_RESPECTFUL- always-0ea5e9?style=for-the-badge&labelColor=0c4a6e" alt="code of conduct">
</div>

We are committed to providing a welcoming and inclusive experience for everyone. Please:

- **Be respectful** and constructive in all interactions
- **Focus on what is best** for the project and community
- **Give and receive feedback** gracefully
- **Disagreement is fine** — personal attacks are not
- **Help others** learn and grow

---

## Getting Started

<div align="center">
  <img src="https://img.shields.io/badge/FIRST_TIME- start_here-22c55e?style=for-the-badge&labelColor=166534" alt="getting started">
</div>

### Prerequisites

| Tool | Version | Install Link |
|------|---------|:------------:|
| <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white" alt="node"> | >= 20.0.0 | [nodejs.org](https://nodejs.org/) |
| <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="pg"> | 14+ | [postgresql.org](https://www.postgresql.org/) |
| <img src="https://img.shields.io/badge/npm-9+-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm"> | 9+ | Comes with Node.js |
| <img src="https://img.shields.io/badge/Git-Latest-F05032?style=flat-square&logo=git&logoColor=white" alt="git"> | Latest | [git-scm.com](https://git-scm.com/) |

### Fork & Clone

```bash
# 1. Fork the repository on GitHub (click "Fork" button)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/transitops.git
cd transitops

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL-org/transitops.git

# 4. Verify remotes
git remote -v
# origin    https://github.com/YOUR_USERNAME/transitops.git (fetch)
# origin    https://github.com/YOUR_USERNAME/transitops.git (push)
# upstream  https://github.com/ORIGINAL-org/transitops.git (fetch)
# upstream  https://github.com/ORIGINAL-org/transitops.git (push)
```

### Environment Setup

```bash
# Backend
cd Transitops-backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
psql $DATABASE_URL -f scripts/01_schema.sql
npm run seed

# Frontend (new terminal)
cd ../Transitops_frontend
npm install
```

### Start Development

```bash
# Terminal 1 — Backend (port 3000)
cd Transitops-backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd Transitops_frontend
npm run dev
```

> [!TIP]
> Open [http://localhost:5173](http://localhost:5173) and log in with `admin@fleetco.com` / `admin123`.

---

## Development Workflow

<div align="center">
  <img src="https://img.shields.io/badge/STEPS- 6_total-8b5cf6?style=for-the-badge&labelColor=581c87" alt="workflow">
</div>

### Step 1: Sync Your Fork

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### Step 2: Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Step 3: Make Your Changes

- Write clean, focused code
- Follow the existing code style
- Add tests for new functionality
- Keep commits small and atomic

### Step 4: Run Checks

```bash
# Backend
cd Transitops-backend
npm test
npm run typecheck  # if applicable

# Frontend
cd ../Transitops_frontend
npm run typecheck
npm run build
```

### Step 5: Commit Your Changes

```bash
git add .
git commit -m "feat(trips): add CSV export for trip history"
```

### Step 6: Push & Create PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub against `main`.

---

## Branch Naming

<div align="center">
  <img src="https://img.shields.io/badge/CONVENTION- type/scope-name-0ea5e9?style=for-the-badge&labelColor=0c4a6e" alt="branch naming">
</div>

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New functionality | `feature/fuel-export-csv` |
| `fix/` | Bug fixes | `fix/trip-dispatch-validation` |
| `refactor/` | Code restructuring | `refactor/extract-service-layer` |
| `docs/` | Documentation only | `docs/api-endpoint-table` |
| `test/` | Adding/updating tests | `test/maintenance-controller` |
| `chore/` | Tooling, config, CI | `chore/update-deps` |

> [!IMPORTANT]
> Use lowercase letters and hyphens only. No slashes after the prefix (except the prefix itself).

---

## Commit Messages

<div align="center">
  <img src="https://img.shields.io/badge/FORMAT- conventional%20commits-22c55e?style=for-the-badge&labelColor=166534" alt="commits">
</div>

Follow the **Conventional Commits** specification:

```
<type>(<scope>): <short description>

<optional body>

<optional footer>
```

### Types

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add password reset flow` |
| `fix` | Bug fix | `fix(trips): prevent double-dispatch` |
| `refactor` | Code restructure | `refactor(vehicles): extract validation` |
| `docs` | Documentation | `docs(readme): update API table` |
| `test` | Tests | `test(drivers): license expiry tests` |
| `chore` | Tooling/deps | `chore: update jest to v29` |
| `perf` | Performance | `perf(queries): add vehicle index` |
| `style` | Formatting | `style: fix eslint warnings` |

### Examples

```
feat(trips): add CSV export for trip history

- Add export button to trip list view
- Generate CSV with all trip fields
- Include date range filter

Closes #42
```

```
fix(auth): prevent token refresh loop on expired sessions

The refresh endpoint was retrying indefinitely when the refresh
token was also expired. Added a check to redirect to login.
```

> [!TIP]
> Write your commit message in the imperative mood: "Add feature" not "Added feature".

---

## Code Style

<div align="center">
  <img src="https://img.shields.io/badge/STANDARDS- consistent%20code-8b5cf6?style=for-the-badge&labelColor=581c87" alt="code style">
</div>

### JavaScript / TypeScript

| Rule | Correct | Incorrect |
|------|---------|-----------|
| Indentation | 2 spaces | Tabs |
| Quotes | `'single'` | `"double"` |
| Semicolons | `;` required | No semicolons |
| Variables | `camelCase` | `snake_case` |
| Components | `PascalCase` | `camelCase` |
| Constants | `UPPER_SNAKE` | `camelCase` |
| Functions | `camelCase` | `PascalCase` |

### React Components

```tsx
// GOOD: Functional component with TypeScript
interface FleetTableProps {
  vehicles: Vehicle[];
  onSelect: (vehicle: Vehicle) => void;
}

export function FleetTable({ vehicles, onSelect }: FleetTableProps) {
  return (
    <div className="rounded-lg border">
      {vehicles.map((v) => (
        <div key={v.id} onClick={() => onSelect(v)}>
          {v.name}
        </div>
      ))}
    </div>
  );
}
```

### Backend Layers

| Layer | File Pattern | Responsibility |
|-------|-------------|----------------|
| Routes | `*.routes.js` | HTTP method + path definitions |
| Controllers | `*.controller.js` | Request/response handling |
| Services | `*.service.js` | Business logic |
| Repositories | `*.repository.js` | Database queries |
| Validators | `*.schema.js` | Joi validation schemas |
| Middleware | `*.middleware.js` | Cross-cutting concerns |

> [!CAUTION]
> Controllers never write SQL. Services never handle HTTP. Repositories never contain business logic. Keep layers separated.

---

## Testing

<div align="center">
  <img src="https://img.shields.io/badge/TESTING- jest%20%2B%20supertest-22c55e?style=for-the-badge&labelColor=166534" alt="testing">
</div>

### Backend Tests

```bash
cd Transitops-backend

# Run all tests with coverage
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

### Frontend Checks

```bash
cd Transitops_frontend

# Type checking (must pass with zero errors)
npm run typecheck

# Production build
npm run build
```

### Writing Tests

```javascript
// tests/unit/vehicle.test.js
const { validateVehicle } = require('../../src/validators/vehicle.schema');

describe('Vehicle Validation', () => {
  it('should reject empty registration number', () => {
    const result = validateVehicle({ regNumber: '' });
    expect(result.error).toBeTruthy();
  });

  it('should accept valid vehicle data', () => {
    const result = validateVehicle({
      regNumber: 'TX-7790',
      name: 'Freightliner',
      type: 'Truck',
      maxCapacity: 12000,
    });
    expect(result.error).toBeFalsy();
  });
});
```

### Test Conventions

- Name test files as `*.test.js` or `*.spec.js`
- Use `describe` blocks for grouping
- Use `it` or `test` for individual cases
- Follow **Arrange → Act → Assert** pattern
- Mock external dependencies (database, APIs)
- Aim for **> 80% coverage** on new code

---

## Pull Request Process

<div align="center">
  <img src="https://img.shields.io/badge/PR_CHECKLIST- before%20submitting-0ea5e9?style=for-the-badge&labelColor=0c4a6e" alt="pr process">
</div>

### Before Submitting

- [ ] Code compiles without errors
- [ ] All existing tests pass (`npm test`)
- [ ] New tests added for new functionality
- [ ] TypeScript types are correct (no `any` unless justified)
- [ ] No `console.log` statements in production code
- [ ] Commit messages follow Conventional Commits
- [ ] Branch is up to date with `main`
- [ ] PR description explains **what** and **why**

### PR Template

```markdown
## What
Brief description of the change.

## Why
Context on why this change is needed.

## How
Key implementation details.

## Testing
How was this tested? Include steps to reproduce.

## Screenshots (if applicable)
UI changes should include before/after screenshots.
```

### Review Process

| Step | Action |
|:----:|:-------|
| 1 | Submit PR against `main` |
| 2 | Automated CI checks must pass |
| 3 | At least one maintainer review required |
| 4 | Address review feedback with new commits |
| 5 | Squash and merge once approved |

> [!NOTE]
> Do **not** force-push during review — it makes it harder for reviewers to see incremental changes.

---

## Project Architecture

<div align="center">
  <img src="https://img.shields.io/badge/ARCHITECTURE- layered%20pattern-8b5cf6?style=for-the-badge&labelColor=581c87" alt="architecture">
</div>

### Request Flow

```
Client (React)
    │
    ▼
API Gateway / Express Router
    │
    ▼
┌──────────────────────────────────────┐
│  Auth Middleware (JWT verify)        │
│         │                            │
│  Role Middleware (RBAC check)        │
│         │                            │
│  Validate Middleware (Joi schemas)   │
│         │                            │
│  Controller (parse request)          │
│         │                            │
│  Service (business logic)            │
│         │                            │
│  Repository (SQL queries)            │
│         │                            │
│  PostgreSQL                          │
└──────────────────────────────────────┘
```

### Key Patterns

| Pattern | Description |
|---------|-------------|
| **Repository Pattern** | All DB queries live in `repositories/`. Controllers never write SQL. |
| **Service Layer** | Business logic in `services/`. Services call repositories and enforce rules. |
| **Validation Middleware** | Joi schemas validate requests before they reach controllers. |
| **RBAC Middleware** | Role-based access enforced at route level. |
| **Error Middleware** | Centralized error handling returns consistent JSON responses. |

---

## Adding a New Feature

<div align="center">
  <img src="https://img.shields.io/badge/GUIDE- step%20by%20step-22c55e?style=for-the-badge&labelColor=166534" alt="new feature">
</div>

### Adding a New API Endpoint

```bash
# 1. Create validation schema
src/validators/yourFeature.schema.js

# 2. Create repository
src/repositories/yourFeature.repository.js

# 3. Create service
src/services/yourFeature.service.js

# 4. Create controller
src/controllers/yourFeature.controller.js

# 5. Create routes
src/routes/yourFeature.routes.js

# 6. Register route in index
src/routes/index.js

# 7. Add role permissions (frontend)
src/config/permissions.ts

# 8. Add frontend service
src/services/yourFeatureService.ts

# 9. Write tests
tests/unit/yourFeature.test.js
```

### Adding a New Frontend Page

```bash
# 1. Create page component
src/pages/YourPage.tsx

# 2. Add route in App.tsx
src/App.tsx

# 3. Add nav item in Sidebar
src/components/layout/Sidebar.tsx

# 4. Add permission in config
src/config/permissions.ts

# 5. Create API service (if needed)
src/services/yourService.ts
```

---

<div align="center">

## Questions?

**Open an issue** or reach out to the maintainers. We're happy to help you get started.

![Built with Love](https://img.shields.io/badge/Built_with-Heart-ff6b6b?style=for-the-badge)

**[Back to Top](#contributing-to-transitops)**

</div>
