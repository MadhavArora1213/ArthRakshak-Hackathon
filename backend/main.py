from fastapi import FastAPI
from api.v1.endpoints import auth, fraud, calculators, goals
from db.init_db import init_db

app = FastAPI()

@app.on_event("startup")
def startup():
    init_db()

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(fraud.router, prefix="/api/v1/fraud", tags=["Fraud Simulation"])
app.include_router(calculators.router, prefix="/api/v1/calculators", tags=["Financial Calculators"])
app.include_router(goals.router, prefix="/api/v1/goals", tags=["Goal Tracker"])
