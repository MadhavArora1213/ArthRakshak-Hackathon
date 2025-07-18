from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError

from core.config import settings

bearer = HTTPBearer(auto_error=False)


def decode_jwt(token: str) -> UUID:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        return UUID(payload["sub"])
    except (KeyError, JWTError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


async def get_current_user_id(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer),
) -> Optional[UUID]:
    if creds is None:
        return None
    return decode_jwt(creds.credentials)
