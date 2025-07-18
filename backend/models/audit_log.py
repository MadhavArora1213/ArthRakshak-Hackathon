# backend/models/audit_log.py
from datetime import datetime

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from db.base import Base


class AuditLog(Base):
    """
    Append‑only audit trail (internal use).
    """
    __tablename__ = "audit_log"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    table_name: Mapped[str] = mapped_column(String(64), nullable=False)
    row_pk: Mapped[str | None]
    action: Mapped[str] = mapped_column(Text, nullable=False)
    actor: Mapped[str | None]
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
