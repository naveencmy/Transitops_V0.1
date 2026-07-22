#!/bin/bash
# One-command local dev setup for TransitOps
# Usage: ./setup.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║        TransitOps - Local Dev Setup                     ║"
echo "╚══════════════════════════════════════════════════════════╝"

# Check prerequisites
for cmd in node npm docker; do
  if ! command -v "$cmd" &> /dev/null; then
    echo "❌ $cmd not found. Please install it first."
    exit 1
  fi
done

echo ""
echo "📦 Setting up backend..."
cd "$ROOT_DIR/Transitops-backend"
npm install

echo ""
echo "📦 Setting up frontend..."
cd "$ROOT_DIR/Transitops_frontend"
npm install

echo ""
echo "🐳 Starting PostgreSQL..."
cd "$SCRIPT_DIR"
docker-compose up -d postgres

echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec transitops-db pg_isready -U postgres &>/dev/null; do
  sleep 1
done
echo "   ✅ PostgreSQL ready"

echo ""
echo "🌱 Seeding database..."
cd "$ROOT_DIR/Transitops-backend"
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/transitops_db"
node scripts/seed.js

echo ""
echo "🚀 Starting backend..."
cd "$ROOT_DIR/Transitops-backend"
npm run dev &
BACKEND_PID=$!

echo ""
echo "🌐 Starting frontend..."
cd "$ROOT_DIR/Transitops_frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║        TransitOps is running!                           ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  Frontend:  http://localhost:5173                       ║"
echo "║  Backend:   http://localhost:3000                       ║"
echo "║  Database:  postgresql://localhost:5432                 ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  Login: admin@fleetco.com / admin123                    ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "echo ''; echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker-compose down; exit 0" SIGINT SIGTERM

wait
