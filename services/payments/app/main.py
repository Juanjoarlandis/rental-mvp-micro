from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import router as api_router

app = FastAPI(title="Payments-Service")

# CORS (frontend local)
origins = (settings.ALLOWED_ORIGINS or "").split(",")
if origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["POST"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix="/api")
