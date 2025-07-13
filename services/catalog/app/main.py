# services/catalog/app/main.py
from fastapi import FastAPI

from app.api import categories, items
from app.models.database import Base, engine
import app.models.models                         #  noqa: F401

app = FastAPI(
    title="rental-mvp – Catalog Service",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

@app.on_event("startup")
def _init_db() -> None:
    Base.metadata.create_all(bind=engine)

app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(items.router,      prefix="/api/items",      tags=["items"])
