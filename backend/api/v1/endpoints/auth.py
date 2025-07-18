# api/v1/endpoints/auth.py
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import get_current_user_id
from db.session import get_db
from schemas.user import UserCreate, UserLogin, UserOut, TokenOut
from services.auth_service import (
    create_user_async,
    authenticate_async,
    issue_access_token,
)
from services.user_service import get_user_by_id_async

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])


@router.post(
    "/signup",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user by mobile number",
)
async def signup(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    return await create_user_async(user_in, db)


@router.post(
    "/login",
    response_model=TokenOut,
    summary="Authenticate (mobile + password) and receive JWT",
)
async def login(
    creds: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> TokenOut:
    user = await authenticate_async(creds.mobile_number, creds.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid mobile number or password",
        )
    return issue_access_token(user_id=user.user_id)


@router.get(
    "/me",
    response_model=UserOut,
    summary="Current user profile (JWT required)",
)
async def me(
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user = await get_user_by_id_async(user_id, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return user
