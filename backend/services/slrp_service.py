from datetime import date, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from models.studnet_loan_repayment_planner_data import StudentLoanRepaymentPlannerData

def calculate_emi(P, R, N):
    # P = principal, R = monthly interest rate, N = number of months
    r = R / (12 * 100)
    emi = P * r * ((1 + r) ** N) / (((1 + r) ** N) - 1)
    return round(emi, 2)

async def create_slrp_record(*, req, db: AsyncSession):
    P = req.loan_amount
    R = req.interest_rate
    N = req.loan_term_years * 12

    # Moratorium: add months to start date, but interest accrues
    moratorium_months = req.moratorium_period or 0
    repayment_start = req.repayment_start_date or date.today()
    repayment_end = repayment_start + timedelta(days=30*N)

    emi = calculate_emi(P, R, N)
    total_repayment = round(emi * N, 2)
    total_interest = round(total_repayment - P, 2)

    record = StudentLoanRepaymentPlannerData(
        user_type=req.user_type,
        loan_amount=P,
        interest_rate=R,
        loan_term_years=req.loan_term_years,
        moratorium_period=moratorium_months,
        monthly_income=req.monthly_income,
        repayment_start_date=repayment_start,
        emi_amount=emi,
        total_interest=total_interest,
        total_repayment=total_repayment,
        repayment_end_date=repayment_end,
    )

    async with db.begin():
        db.add(record)

    return {
        "emi_amount": emi,
        "total_interest": total_interest,
        "total_repayment": total_repayment,
        "repayment_end_date": repayment_end,
    }