# services/auth_service.py
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import HTTPException, status
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from core.logger import log
from models.user import User
from schemas.user import UserCreate
from services.user_service import get_user_by_mobile_async

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGO = "HS256"
TOKEN_TTL_MINUTES = 60


def _hash_password(password: str) -> str:
    return pwd_context.hash(password)


def _verify(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


async def create_user_async(user_in: UserCreate, db: AsyncSession) -> User:
    try:
        async with db.begin():
            user = User(
                mobile_number=user_in.mobile_number,
                hashed_password=_hash_password(user_in.password),
            )
            db.add(user)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Mobile number already registered",
        )

    log.info("user_signed_up", mobile=user_in.mobile_number)
    return user


async def authenticate_async(
    mobile_number: str, password: str, db: AsyncSession
) -> User | None:
    user = await get_user_by_mobile_async(mobile_number, db)
    if user and _verify(password, user.hashed_password):
        return user
    return None


def issue_access_token(*, user_id: UUID) -> dict:
    exp = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_TTL_MINUTES)
    payload = {"sub": str(user_id), "exp": exp}
    token = jwt.encode(payload, settings.secret_key, algorithm=ALGO)
    return {"access_token": token, "token_type": "bearer"}
