# services/auth/app/api/health.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text            # 👈🏻 NEW

from app.deps import get_db

router = APIRouter(tags=["health"])

@router.get("/health", summary="Lightweight liveness & DB check")
def health(db: Session = Depends(get_db)):
    try:
        # SQLAlchemy 2.0 exige usar text() para SQL literal
        db.execute(text("SELECT 1"))   # 👈🏻 FIX
        db_status = "ok"
    except SQLAlchemyError:
        db_status = "error"
    return {"ok": True, "db": db_status}
