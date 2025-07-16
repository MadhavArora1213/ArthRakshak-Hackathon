from fastapi import APIRouter

router = APIRouter()

@router.get("/emi")
def calculate_emi(principal: float = 100000, rate: float = 10.0, time: int = 12):
    """
    Basic EMI Calculator: EMI = [P x R x (1+R)^N] / [(1+R)^N – 1]
    """
    monthly_rate = rate / (12 * 100)
    emi = (principal * monthly_rate * (1 + monthly_rate) ** time) / ((1 + monthly_rate) ** time - 1)
    return {
        "principal": principal,
        "rate": rate,
        "time_months": time,
        "emi": round(emi, 2)
    }
