# backend/alembic/env.py
"""
Make Alembic talk to Postgres synchronously – avoid MissingGreenlet.
"""
from logging.config import fileConfig
from sqlalchemy import create_engine, pool
from alembic import context
import os, sys

# ── load .ini logging ───────────────────────────────────────────────────────
config = context.config
fileConfig(config.config_file_name)

# ── app metadata ────────────────────────────────────────────────────────────
sys.path.append(os.getcwd())

# Import models first to register them with Base.metadata
import models

from db.base import Base                     # registers all models
from core.config import settings             # DATABASE_URL from .env

# Use a **sync** driver for migrations (psycopg2), even if app uses asyncpg
sync_url = settings.database_url.replace("+asyncpg", "")
connectable = create_engine(
    sync_url, poolclass=pool.NullPool, future=True
)

target_metadata = Base.metadata

def run_migrations_online() -> None:
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()

run_migrations_online()
