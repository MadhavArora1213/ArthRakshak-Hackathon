from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from models.monthly_budget_planner_data import MonthlyBudgetPlannerData

def _budget_status(balance: float) -> str:
    if balance > 0:
        return "Surplus"
    if balance < 0:
        return "Deficit"
    return "Break-even"

async def create_mbp_record(*, user_id, req, db: AsyncSession):
    now = datetime.now(timezone.utc)
    mbp_id = uuid4()

    income_total = req.income_monthly + req.income_other
    fixed_total = (
        req.rent + req.electricity + req.internet + req.recharge +
        req.emi + req.insurance + req.school_fees + req.fixed_others
    )
    variable_total = (
        req.groceries + req.food_outside + req.transport + req.entertainment +
        req.shopping + req.medical + req.travel + req.donation + req.variable_others
    )
    expenses_total = fixed_total + variable_total
    balance_remaining = income_total - expenses_total
    savings_recommended = income_total * (req.savings_percent_goal / 100)
    savings_achieved_percent = (
        (balance_remaining / income_total) * 100 if income_total else 0
    )
    budget_status = _budget_status(balance_remaining)

    async with db.begin():
        db.add(
            MonthlyBudgetPlannerData(
                id=mbp_id,
                user_id=user_id,
                user_type=req.user_type,
                age=req.age,
                location_type=req.location_type,
                income_source=req.income_source,
                income_monthly=req.income_monthly,
                income_other=req.income_other,
                income_total=income_total,
                rent=req.rent,
                electricity=req.electricity,
                internet=req.internet,
                recharge=req.recharge,
                emi=req.emi,
                insurance=req.insurance,
                school_fees=req.school_fees,
                fixed_others=req.fixed_others,
                fixed_total=fixed_total,
                groceries=req.groceries,
                food_outside=req.food_outside,
                transport=req.transport,
                entertainment=req.entertainment,
                shopping=req.shopping,
                medical=req.medical,
                travel=req.travel,
                donation=req.donation,
                variable_others=req.variable_others,
                variable_total=variable_total,
                savings_target=req.savings_target,
                savings_percent_goal=req.savings_percent_goal,
                savings_recommended=savings_recommended,
                expenses_total=expenses_total,
                balance_remaining=balance_remaining,
                savings_achieved_percent=savings_achieved_percent,
                budget_status=budget_status,
                personality_tag=None,
                fraud_tip=None,
                language_preference=req.language_preference,
                created_at=now,
            )
        )

    return {
        "id": mbp_id,
        "income_total": income_total,
        "fixed_total": fixed_total,
        "variable_total": variable_total,
        "savings_recommended": savings_recommended,
        "expenses_total": expenses_total,
        "balance_remaining": balance_remaining,
        "savings_achieved_percent": savings_achieved_percent,
        "budget_status": budget_status,
        "personality_tag": None,
        "fraud_tip": None,
        "created_at": now,
    }