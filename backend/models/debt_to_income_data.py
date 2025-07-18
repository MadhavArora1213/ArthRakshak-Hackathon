from uuid import UUID

from sqlalchemy import ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base


class DebtToIncomeData(Base):
    __tablename__ = "debt_to_income_data"

    history_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("calculator_history.history_id", ondelete="CASCADE"),
        primary_key=True,
    )
    monthly_debt: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    gross_income: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    dti_pct: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)

    history = relationship("CalculatorHistory", back_populates="dti")
