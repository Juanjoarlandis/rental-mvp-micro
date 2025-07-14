# services/auth/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # MODIFIED: Importado para CORS
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api import auth, health, password          # ← nuevos routers
from app.core.ratelimit import limiter
from app.models.database import Base, engine
import app.models.models        # noqa: F401  (importa tablas)

from app.core.config import settings  # MODIFIED: Para orígenes CORS

app = FastAPI(
    title="rental‑mvp – Auth Service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi/v1.json",   # ← OpenAPI versionada
)

# MODIFIED: Añadir CORS middleware (best practice: orígenes específicos)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],  # De .env o config
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────── BD auto‑create (solo dev) ───────────
@app.on_event("startup")
def _init_db() -> None:
    Base.metadata.create_all(bind=engine)

# ─────────── Rate‑limit global handler ───────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─────────── Rutas ───────────
app.include_router(auth.router,     prefix="/api/auth")
app.include_router(password.router, prefix="/api/auth")
app.include_router(health.router)   # /health a raíz