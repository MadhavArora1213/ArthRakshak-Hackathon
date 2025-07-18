from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from models.calculator_history import CalculatorHistory
from models.debt_to_income_data import DebtToIncomeData


def _risk_band(pct: float) -> str:
    if pct < 20:
        return "Low"
    if pct < 35:
        return "Medium"
    return "High"


async def create_dti_record(*, user_id, req, db: AsyncSession):
    pct = round((req.monthly_debt / req.gross_income) * 100, 2)
    risk = _risk_band(pct)

    now = datetime.now(timezone.utc)
    hid = uuid4()

    async with db.begin():
        db.add(
            CalculatorHistory(
                history_id=hid,
                user_id=user_id,
                calculator_type="dti",
                input_data=req.dict(),
                output_data={"dti_pct": pct, "risk": risk},
                created_at=now,
            )
        )
        db.add(
            DebtToIncomeData(
                history_id=hid,
                monthly_debt=req.monthly_debt,
                gross_income=req.gross_income,
                dti_pct=pct,
            )
        )

    return pct, risk, hid, now


async def recent_dti(*, user_id, limit: int, db: AsyncSession):
    q = await db.execute(
        text(
            """
            SELECT output_data, created_at
              FROM calculator_history
             WHERE user_id = :uid
               AND calculator_type = 'dti'
          ORDER BY created_at DESC
             LIMIT :lim
            """
        ),
        {"uid": str(user_id), "lim": limit},
    )
    rows = q.all()
    return [
        {
            "dti_pct": row.output_data["dti_pct"],
            "risk_level": row.output_data["risk"],
            "created_at": row.created_at,
        }
        for row in rows
    ]
