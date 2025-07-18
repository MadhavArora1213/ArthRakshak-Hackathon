from fastapi import APIRouter, Depends

from core.security import get_current_user_id
from db.session import get_db
from schemas.dti import DTIRequest, DTIResponse
from services.dti_service import create_dti_record, recent_dti

router = APIRouter(prefix="/api/v1/calculators", tags=["Calculators"])


@router.post("/dti", response_model=DTIResponse, status_code=201)
async def run_dti(
    payload: DTIRequest,
    user_id=Depends(get_current_user_id),
    db=Depends(get_db),
):
    pct, risk, hid, ts = await create_dti_record(user_id=user_id, req=payload, db=db)
    return {"dti_pct": pct, "risk_level": risk, "history_id": hid, "created_at": ts}


@router.get("/dti/recent")
async def recent(
    limit: int = 5,
    user_id=Depends(get_current_user_id),
    db=Depends(get_db),
):
    return await recent_dti(user_id=user_id, limit=limit, db=db)
