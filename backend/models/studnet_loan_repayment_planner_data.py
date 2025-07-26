from sqlalchemy import Numeric, Integer, String, Date
from sqlalchemy.orm import Mapped, mapped_column
from db.base import Base

class StudentLoanRepaymentPlannerData(Base):
    __tablename__ = "student_loan_planner"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_type: Mapped[str] = mapped_column(String(50))
    loan_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    interest_rate: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    loan_term_years: Mapped[int] = mapped_column(Integer, nullable=False)
    moratorium_period: Mapped[int] = mapped_column(Integer, nullable=True)
    monthly_income: Mapped[float] = mapped_column(Numeric(10, 2), nullable=True)
    repayment_start_date: Mapped[Date] = mapped_column(Date, nullable=True)

    emi_amount: Mapped[float] = mapped_column(Numeric(10, 2))
    total_interest: Mapped[float] = mapped_column(Numeric(12, 2))
    total_repayment: Mapped[float] = mapped_column(Numeric(12, 2))
    repayment_end_date: Mapped[Date] = mapped_column(Date, nullable=True)