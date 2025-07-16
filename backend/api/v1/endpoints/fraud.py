from fastapi import APIRouter

router = APIRouter()

@router.get("/simulate")
def simulate_fraud():
    return {"message": "Fraud simulation endpoint"}
