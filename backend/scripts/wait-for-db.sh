#!/usr/bin/env bash
set -e

host="db"
port="5432"
user="postgres"
password="1234"
database="arthrakshak"

echo "⏳  Waiting for PostgreSQL at ${host}:${port}..."

until PGPASSWORD=$password psql -h "$host" -p "$port" -U "$user" -d "$database" -c '\q' 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅  PostgreSQL is up - executing command"