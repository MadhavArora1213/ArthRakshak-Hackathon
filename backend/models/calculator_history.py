from datetime import datetime
from uuid import uuid4, UUID

from sqlalchemy import Index, JSON, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base


class CalculatorHistory(Base):
    __tablename__ = "calculator_history"
    __table_args__ = (
        Index("ix_calc_hist_user_created_at", "user_id", "created_at"),
    )

    history_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), nullable=True)
    calculator_type: Mapped[str] = mapped_column(
        ForeignKey("calculator_type_ref.type_id"), nullable=False
    )
    input_data: Mapped[dict] = mapped_column(JSON, nullable=False)
    output_data: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    dti = relationship("DebtToIncomeData", back_populates="history", uselist=False)
