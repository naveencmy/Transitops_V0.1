#!/bin/bash
# Reset TransitOps database to seed state for demo
# Usage: ./demo-reset.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║        TransitOps Demo Reset                            ║"
echo "╚══════════════════════════════════════════════════════════╝"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ DATABASE_URL not set."
  exit 1
fi

if ! command -v psql &> /dev/null; then
  echo "❌ psql not found."
  exit 1
fi

echo ""
echo "🗑️  Dropping all data..."
psql "$DATABASE_URL" -c "
  TRUNCATE expenses, fuel_logs, maintenance_logs, trips, drivers, vehicles, users, roles CASCADE;
"

echo ""
echo "📐 Recreating schema..."
BACKEND_DIR="$(dirname "$SCRIPT_DIR")/../Transitops-backend"
psql "$DATABASE_URL" -f "$BACKEND_DIR/scripts/01_schema.sql"

echo ""
echo "🌱 Seeding fresh data..."
cd "$BACKEND_DIR"
node scripts/seed.js

echo ""
echo "✅ Demo reset complete! Database is fresh."
echo ""
echo "Login Credentials:"
echo "   Admin:          admin@fleetco.com / admin123"
echo "   Fleet Manager:  fleet@fleetco.com / fleet123"
echo "   Dispatcher:     dispatch@fleetco.com / dispatch123"
