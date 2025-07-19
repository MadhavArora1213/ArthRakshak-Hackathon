from datetime import date, datetime
from uuid import UUID
from pydantic import BaseModel, Field

class SLRPRequest(BaseModel):
    user_type: str
    loan_amount: float = Field(gt=0)
    interest_rate: float = Field(gt=0)
    loan_term_years: int = Field(gt=0)
    moratorium_period: int | None = None
    monthly_income: float | None = None
    repayment_start_date: date | None = None

class SLRPResponse(BaseModel):
    emi_amount: float
    total_interest: float
    total_repayment: float
    repayment_end_date: date | None = None
    history_id: UUID
    created_at: datetime