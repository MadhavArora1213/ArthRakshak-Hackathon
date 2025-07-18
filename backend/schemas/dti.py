from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class DTIRequest(BaseModel):
    monthly_debt: float = Field(gt=0)
    gross_income: float = Field(gt=0)


class DTIResponse(BaseModel):
    dti_pct: float
    risk_level: str
    history_id: UUID
    created_at: datetime
