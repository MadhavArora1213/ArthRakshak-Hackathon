from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

goals_db = []

class GoalCreate(BaseModel):
    name: str
    target_amount: float
    deadline: Optional[str] = None

@router.post("/create")
def create_goal(goal: GoalCreate):
    goals_db.append(goal.dict())
    return {"message": "Goal created", "goal": goal}

@router.get("/list")
def list_goals():
    return {"goals": goals_db}
