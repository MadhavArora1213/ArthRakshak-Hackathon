# backend/models/__init__.py
"""
Auto‑import all model modules exactly **once** so that they register
themselves with `Base.metadata`.  Any new model you create should be
added to this list.

Why?
  • Alembic's `autogenerate` needs every table loaded.
  • `Base.metadata.create_all()` only ‘sees’ tables that are imported.
"""

from .user import User  # noqa: F401
from .calculator_type_ref import CalculatorTypeRef  # noqa: F401
from .calculator_history import CalculatorHistory  # noqa: F401
from .debt_to_income_data import DebtToIncomeData  # noqa: F401
from .audit_log import AuditLog  # noqa: F401

__all__ = (
    "User",
    "CalculatorTypeRef",
    "CalculatorHistory",
    "DebtToIncomeData",
    "AuditLog",
)
