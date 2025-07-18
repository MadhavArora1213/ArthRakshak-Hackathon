from sqlalchemy.orm import DeclarativeBase
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from core.config import settings
from db.base import Base

# Import all models to register them with Base.metadata
import models  # This imports all models via models/__init__.py


class Base(DeclarativeBase):  # type: ignore[type-arg]
    """Shared metadata registry."""
    pass


async def init_db_async():
    """Initialize database tables."""
    engine = create_async_engine(settings.database_url, echo=False)

    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

    await engine.dispose()
    print("✅ Database initialized successfully")


if __name__ == "__main__":
    asyncio.run(init_db_async())
