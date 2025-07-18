# services/user_service.py
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User


async def get_user_by_mobile_async(
    mobile_number: str, db: AsyncSession
) -> User | None:
    stmt = select(User).where(User.mobile_number == mobile_number)
    res = await db.execute(stmt)
    return res.scalar_one_or_none()


async def get_user_by_id_async(
    user_id: UUID, db: AsyncSession
) -> User | None:
    stmt = select(User).where(User.user_id == user_id)
    res = await db.execute(stmt)
    return res.scalar_one_or_none()
