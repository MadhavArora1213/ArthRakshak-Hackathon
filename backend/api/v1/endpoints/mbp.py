from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import get_current_user_id
from db.session import get_db
from schemas.mbp import MBPRequest, MBPResponse
from services.mbp_service import create_mbp_record

router = APIRouter(prefix="/api/v1/mbp", tags=["MonthlyBudgetPlanner"])

@router.post("/", response_model=MBPResponse, status_code=status.HTTP_201_CREATED)
async def run_mbp(
    payload: MBPRequest,
    user_id=Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await create_mbp_record(user_id=user_id, req=payload, db=db)
    return result