# services/rentals/app/main.py
from fastapi import FastAPI

from app.api import rentals

app = FastAPI(
    title="rental-mvp – Rentals Service",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# La BD se gestiona exclusivamente con Alembic;
# no ejecutamos create_all() para evitar conflictos.
# (Si lo prefieres, elimina por completo este fichero on_event)
#
# from app.models.database import Base, engine
# @app.on_event("startup")
# def _init_db() -> None:
#     Base.metadata.create_all(bind=engine)

app.include_router(rentals.router, prefix="/api/rentals", tags=["rentals"])
