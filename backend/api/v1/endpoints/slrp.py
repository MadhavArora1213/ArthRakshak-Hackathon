from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from schemas.slrp import SLRPRequest, SLRPResponse
from services.slrp_service import create_slrp_record

router = APIRouter(prefix="/api/v1/calculators", tags=["Calculators"])

@router.post("/slrp", response_model=SLRPResponse, status_code=status.HTTP_201_CREATED)
async def run_slrp(
    payload: SLRPRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await create_slrp_record(req=payload, db=db)
    return result