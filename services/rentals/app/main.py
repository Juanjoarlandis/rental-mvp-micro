# services/rentals/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # MODIFIED

from app.api import rentals

from app.core.config import settings  # MODIFIED

app = FastAPI(
    title="rental-mvp – Rentals Service",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# MODIFIED: CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

app.include_router(rentals.router, prefix="/api/rentals", tags=["rentals"])