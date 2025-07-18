#!/usr/bin/env bash
set -e

echo "🔄  Starting ArthRakshak API …"

# ── wait for Postgres ───────────────────────────────────────────────────────
/app/scripts/wait-for-db.sh "postgresql://postgres:1234@db:5432/arthrakshak"

# ── run migrations (safe‑to‑fail in dev) ───────────────────────────────────
echo "🗄️  Running Alembic migrations…"
alembic upgrade head || true

# ── launch Uvicorn ─────────────────────────────────────────────────────────
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload