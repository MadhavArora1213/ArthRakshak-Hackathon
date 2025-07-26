from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field

class MBPRequest(BaseModel):
    user_id: UUID | None = None
    user_type: str
    age: int
    location_type: str
    income_source: str

    income_monthly: float
    income_other: float

    rent: float
    electricity: float
    internet: float
    recharge: float
    emi: float
    insurance: float
    school_fees: float
    fixed_others: float

    groceries: float
    food_outside: float
    transport: float
    entertainment: float
    shopping: float
    medical: float
    travel: float
    donation: float
    variable_others: float

    savings_target: float
    savings_percent_goal: float
    language_preference: str | None = None

class MBPResponse(BaseModel):
    id: UUID
    income_total: float
    fixed_total: float
    variable_total: float
    savings_recommended: float
    expenses_total: float
    balance_remaining: float
    savings_achieved_percent: float
    budget_status: str
    personality_tag: str | None = None
    fraud_tip: str | None = None
    created_at: datetime