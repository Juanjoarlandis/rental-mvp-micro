# services/rentals/app/main.py
from fastapi import FastAPI

from app.api import rentals
from app.models.database import Base, engine
import app.models.models                         #  noqa: F401

app = FastAPI(
    title="rental-mvp – Rentals Service",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

@app.on_event("startup")
def _init_db() -> None:
    Base.metadata.create_all(bind=engine)

app.include_router(rentals.router, prefix="/api/rentals", tags=["rentals"])
