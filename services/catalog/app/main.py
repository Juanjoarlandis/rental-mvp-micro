# services/catalog/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # MODIFIED: CORS

from app.api import categories, items
from app.models.database import Base, engine
import app.models.models                         #  noqa: F401

from app.core.config import settings  # MODIFIED: Para CORS

app = FastAPI(
    title="rental-mvp – Catalog Service",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# MODIFIED: CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def _init_db() -> None:
    Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"ok": True}

app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(items.router,      prefix="/api/items",      tags=["items"])