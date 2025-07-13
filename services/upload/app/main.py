from fastapi import FastAPI
from app.api import router as api_router
from app.api.upload import mount_static     # reutilizamos la helper

app = FastAPI(title="Upload-Service")

# Rutas de API (quedarán bajo /api)
app.include_router(api_router, prefix="/api")

# Ficheros estáticos (imágenes subidas)
mount_static(app)
