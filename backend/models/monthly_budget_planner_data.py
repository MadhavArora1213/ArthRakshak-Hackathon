from uuid import UUID
from sqlalchemy import Numeric, String, Integer, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column
from db.base import Base

class MonthlyBudgetPlannerData(Base):
    __tablename__ = "monthly_budget_planner"

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True)
    user_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), nullable=True)
    user_type: Mapped[str] = mapped_column(String(30), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    location_type: Mapped[str] = mapped_column(String(20), nullable=False)
    income_source: Mapped[str] = mapped_column(String(50), nullable=False)

    income_monthly: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    income_other: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    income_total: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    rent: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    electricity: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    internet: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    recharge: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    emi: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    insurance: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    school_fees: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    fixed_others: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    fixed_total: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    groceries: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    food_outside: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    transport: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    entertainment: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    shopping: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    medical: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    travel: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    donation: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    variable_others: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    variable_total: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    savings_target: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    savings_percent_goal: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    savings_recommended: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    expenses_total: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    balance_remaining: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    savings_achieved_percent: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    budget_status: Mapped[str] = mapped_column(String(20), nullable=False)

    personality_tag: Mapped[str] = mapped_column(String(50), nullable=True)
    fraud_tip: Mapped[str] = mapped_column(Text, nullable=True)
    language_preference: Mapped[str] = mapped_column(String(20), nullable=True)
    created_at: Mapped = mapped_column(TIMESTAMP, nullable=False)