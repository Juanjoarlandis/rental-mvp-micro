# services/upload/app/api/upload.py
"""
Endpoint privado para subir imágenes y exponerlas luego en /uploads/…
Devuelve **SIEMPRE** la ruta relativa “/uploads/<uuid>.<ext>” para que el
frontend la combine con su propio dominio (evitamos el host interno “upload”).
"""
from __future__ import annotations

import os
import shutil
import uuid
from pathlib import Path
from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.staticfiles import StaticFiles
from jose import JWTError, jwt

# ────────────────────────────────────────────────────────────────────────────
# Configuración global
# ────────────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# La clave/algoritmo deben ser los mismos que usa el auth-service
JWT_SECRET = os.getenv("SECRET_KEY", "SuperClaveUltraSecreta")
JWT_ALGORITHM = os.getenv("ALGORITHM", "HS256")

# ────────────────────────────────────────────────────────────────────────────
# Seguridad (Bearer JWT)
# ────────────────────────────────────────────────────────────────────────────
security = HTTPBearer()


def get_current_username(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username: str | None = payload.get("sub")
        if not username:
            raise ValueError
        return username
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token JWT inválido",
        )


# ────────────────────────────────────────────────────────────────────────────
# Router
# ────────────────────────────────────────────────────────────────────────────
router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    _user: str = Depends(get_current_username),  # protegido con JWT
):
    # 1) validar tipo mime
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Solo se permiten imágenes")

    # 2) generar nombre único y guardar
    ext = Path(file.filename).suffix
    filename = f"{uuid.uuid4()}{ext}"
    filepath = UPLOAD_DIR / filename
    try:
        with filepath.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()

    # 3) ruta pública **relativa**
    return {"filename": filename, "url": f"/uploads/{filename}"}


# ────────────────────────────────────────────────────────────────────────────
# Montaje estático (/uploads)  →  se llama desde app.main
# ────────────────────────────────────────────────────────────────────────────
def mount_static(app):
    app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
