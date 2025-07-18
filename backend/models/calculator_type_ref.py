# backend/models/calculator_type_ref.py
from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from db.base import Base


class CalculatorTypeRef(Base):
    __tablename__ = "calculator_type_ref"

    type_id: Mapped[str] = mapped_column(
        Enum("dti", name="calculator_type_enum"),
        primary_key=True,
    )
    description: Mapped[str] = mapped_column(String(64), nullable=False)
