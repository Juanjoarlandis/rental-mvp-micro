# services/auth/app/main.py
from fastapi import FastAPI

from app.api import auth                     # rutas
from app.models.database import Base, engine
import app.models.models                     # importa modelos (no eliminar)  noqa: F401

app = FastAPI(
    title="rental-mvp – Auth Service",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ────────────────────────────────────────────────────────────────
#  Crea las tablas si aún no existen (solo útil en entornos de
#  desarrollo o en tests.  En prod usarás `alembic upgrade head`).
# ────────────────────────────────────────────────────────────────
@app.on_event("startup")
def _init_db() -> None:
    Base.metadata.create_all(bind=engine)

# rutas REST
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
