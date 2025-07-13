# services/catalog/app/schemas/item.py
from __future__ import annotations

from typing import List, Optional

from pydantic import (
    BaseModel,
    Field,
    PositiveFloat,
    AfterValidator,      # 🆕 validador ligero en v2
)
from typing_extensions import Annotated   # Annotated en 3.12

from .category import CategoryOut


# ────────────────────────────────────────────────────────────────────
#  Tipo URL “relajado” → admite http(s)://…  o  rutas relativas “/…”
# ────────────────────────────────────────────────────────────────────
def _check_url(v: str) -> str:
    if v.startswith(("http://", "https://", "/")):
        return v
    raise ValueError("url debe ser http(s)://… o empezar por /uploads/…")


UrlStr = Annotated[str, AfterValidator(_check_url)]


# ─────────────────────────── SCHEMAS ────────────────────────────────
class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    description: Optional[str] = None
    price_per_h: PositiveFloat


class ItemCreate(ItemBase):
    image_urls: List[UrlStr] = Field(..., min_length=1, max_length=6)
    categories: Optional[List[int]] = Field(
        default=None, description="IDs de categorías asociadas"
    )


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=80)
    description: Optional[str] = None
    price_per_h: Optional[PositiveFloat] = None
    image_urls: Optional[List[UrlStr]] = Field(None, min_length=1, max_length=6)
    categories: Optional[List[int]] = None

    model_config = {"extra": "forbid"}


class ItemOut(ItemBase):
    id: int
    available: bool
    owner_username: str
    categories: List[CategoryOut]
    image_urls: List[UrlStr]
    image_url: Optional[UrlStr] = None  # compat con versiones antiguas

    model_config = {"from_attributes": True}
