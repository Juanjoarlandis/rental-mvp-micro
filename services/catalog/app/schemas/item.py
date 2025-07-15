from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field, PositiveFloat, AfterValidator, StringConstraints
from typing_extensions import Annotated
from pydantic import field_validator  
from .category import CategoryOut

# ─── validadores auxiliares ────────────────────────────────────────────
def _check_url(v: str) -> str:
    if v.startswith(("http://", "https://", "/")):
        return v
    raise ValueError("url debe ser http(s)://… o empezar por /uploads/…")

UrlStr = Annotated[str, AfterValidator(_check_url)]
Hashtag = Annotated[str, StringConstraints(pattern="^#[A-Za-z0-9_]{1,30}$")]

# ─── BASE ──────────────────────────────────────────────────────────────
class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    description: Optional[str] = None
    price_per_h: PositiveFloat
    compare_at_price: Optional[PositiveFloat] = None
    sku: Optional[str] = Field(None, max_length=40)
    stock: int = Field(1, ge=0)
    weight_kg: Optional[PositiveFloat] = None
    shipping_type: str = Field("free", pattern="^(free|local_pickup|paid)$")
    condition: str = Field("new", pattern="^(new|used)$")

    # ── ⚠️ el problema estaba aquí ─────────────────────────
    hashtags: List[Hashtag] = Field(default_factory=list, max_items=5)

    # ⬇️ normaliza None → []
    @field_validator("hashtags", mode="before")
    @classmethod
    def _none_to_list(cls, v):
        # Pydantic llama al validador antes de validar tipos ⇒
        # si viene None devolvemos lista vacía
        return v or []


# ─── CREATE ────────────────────────────────────────────────────────────
class ItemCreate(ItemBase):
    image_urls: List[UrlStr] = Field(..., min_length=1, max_length=10)
    categories: Optional[List[int]] = Field(
        default=None, description="IDs de categorías asociadas"
    )

# ─── UPDATE ────────────────────────────────────────────────────────────
class ItemUpdate(BaseModel):
    # todos opcionales
    name: Optional[str] = Field(None, min_length=1, max_length=80)
    description: Optional[str] = None
    price_per_h: Optional[PositiveFloat] = None
    compare_at_price: Optional[PositiveFloat] = None
    sku: Optional[str] = Field(None, max_length=40)
    stock: Optional[int] = Field(None, ge=0)
    weight_kg: Optional[PositiveFloat] = None
    shipping_type: Optional[str] = Field(None, pattern="^(free|local_pickup|paid)$")
    condition: Optional[str] = Field(None, pattern="^(new|used)$")
    hashtags: Optional[List[Hashtag]] = Field(default=None, max_items=5)
    image_urls: Optional[List[UrlStr]] = Field(None, min_items=1, max_items=10)
    categories: Optional[List[int]] = None

    model_config = {"extra": "forbid"}

# ─── OUT ───────────────────────────────────────────────────────────────
class ItemOut(ItemBase):
    id: int
    available: bool
    owner_username: str
    categories: List[CategoryOut]
    image_urls: List[UrlStr]
    image_url: Optional[UrlStr] = None  # compat

    model_config = {"from_attributes": True}
