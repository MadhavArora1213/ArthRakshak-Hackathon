from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import models first to ensure they're registered
import models

from api.v1.endpoints.auth import router as auth_router
from api.v1.endpoints.dti import router as dti_router
from core.logger import log
from db.init_db import init_db_async
from db.session import SessionLocal

app = FastAPI(title="ArthRakshak API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(dti_router)


@app.on_event("startup")
async def _startup() -> None:
    log.info("Boot‑strapping database …")
    await init_db_async()
    log.info("✅ DB ready")


@app.middleware("http")
async def audit_logger(request: Request, call_next):
    async with SessionLocal() as db:
        response = await call_next(request)
        try:
            await db.execute(
                """
                INSERT INTO audit_log(table_name, row_pk, action, actor)
                VALUES ('request', NULL, :action, NULL)
                """,
                {"action": request.url.path},
            )
            await db.commit()
        except Exception as exc:
            log.error(f"audit_insert_failed | {exc}")
        return response
