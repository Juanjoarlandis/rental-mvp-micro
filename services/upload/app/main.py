from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # MODIFIED

from app.api import router as api_router
from app.api.upload import mount_static     # reutilizamos la helper

from app.core.config import settings  # MODIFIED

app = FastAPI(title="Upload-Service")

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

# Rutas de API (quedarán bajo /api)
app.include_router(api_router, prefix="/api")

# Ficheros estáticos (imágenes subidas)
mount_static(app)