# services/catalog/app/api/upload.py
"""
Endpoint para subir imágenes desde el catálogo.
También devuelve la **ruta relativa** /uploads/…  para evitar problemas de host.
"""
from __future__ import annotations

import os
import shutil
import uuid
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    UploadFile,
    status,
)

from app.deps import get_current_username

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile,
    request: Request,
    _user=Depends(get_current_username),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Solo imágenes")

    ext = Path(file.filename).suffix
    name = f"{uuid.uuid4()}{ext}"
    path = UPLOAD_DIR / name

    with path.open("wb") as buf:
        shutil.copyfileobj(file.file, buf)

    # ← ruta relativa
    return {"url": f"/uploads/{name}"}
