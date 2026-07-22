#!/bin/bash
# Seed TransitOps database (Neon PostgreSQL)
# Usage: ./seed-db.sh [--reset]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$ROOT_DIR/../Transitops-backend"

RESET=false
if [ "${1:-}" = "--reset" ]; then
  RESET=true
fi

echo "╔══════════════════════════════════════════════════════════╗"
echo "║        TransitOps Database Seed                         ║"
echo "╚══════════════════════════════════════════════════════════╝"

# Check DATABASE_URL
if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ DATABASE_URL not set."
  echo ""
  echo "Usage:"
  echo "  export DATABASE_URL='postgresql://user:pass@ep-xxx.neon.tech/transitops'"
  echo "  ./seed-db.sh"
  exit 1
fi

# Check psql
if ! command -v psql &> /dev/null; then
  echo "❌ psql not found. Install PostgreSQL client."
  exit 1
fi

# Step 1: Create schema
echo ""
echo "📐 Creating schema..."
psql "$DATABASE_URL" -f "$BACKEND_DIR/scripts/01_schema.sql"
echo "   ✅ Schema created"

# Step 2: Seed data
if [ "$RESET" = true ]; then
  echo ""
  echo "🗑️  Resetting database (dropping all data)..."
  psql "$DATABASE_URL" -c "
    TRUNCATE expenses, fuel_logs, maintenance_logs, trips, drivers, vehicles, users, roles CASCADE;
  "
  echo "   ✅ Database reset"
fi

echo ""
echo "🌱 Seeding data..."
cd "$BACKEND_DIR"
node scripts/seed.js

echo ""
echo "✅ Database seeded successfully!"
