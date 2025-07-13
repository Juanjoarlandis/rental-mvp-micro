from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, field_validator, PositiveFloat
from typing import Literal

class RentalCreate(BaseModel):
    item_id: int
    start_at: datetime
    end_at: datetime

    @field_validator("end_at")
    @classmethod
    def end_must_be_after_start(cls, v: datetime, info):
        start = info.data["start_at"]
        if v <= start:
            raise ValueError("end_at debe ser posterior a start_at")
        return v


# 🛈 “ItemSnapshot” es la versión mínima que necesita el front
class ItemSnapshot(BaseModel):
    id: int
    name: str
    price_per_h: PositiveFloat
    image_url: str | None = None
    image_urls: list[str] | None = None
    available: bool | None = None


class RentalOut(RentalCreate):
    id: int
    deposit: float
    status: Literal["pending", "confirmed", "returned"]
    renter_username: str
    item: ItemSnapshot
