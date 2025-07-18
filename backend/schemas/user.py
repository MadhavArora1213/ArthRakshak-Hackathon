# backend/schemas/user.py
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


_MOBILE_PATTERN = r"^\+\d{10,15}$"  # e.g. “+911234567890”


# ──────────────────────────────────────────────────────────────────────────────
#  Incoming payloads
# ──────────────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    mobile_number: str = Field(pattern=_MOBILE_PATTERN)
    password: str = Field(min_length=8)


class UserLogin(BaseModel):
    mobile_number: str = Field(pattern=_MOBILE_PATTERN)
    password: str


# ──────────────────────────────────────────────────────────────────────────────
#  Outgoing payloads
# ──────────────────────────────────────────────────────────────────────────────
class UserOut(BaseModel):
    user_id: UUID
    mobile_number: str
    created_at: datetime

    # Pydantic‑v2: replaces `orm_mode = True`
    model_config = ConfigDict(from_attributes=True)


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
