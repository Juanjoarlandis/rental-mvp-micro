from __future__ import annotations

import math
from decimal import Decimal, ROUND_HALF_UP
from typing import List

import httpx
from sqlalchemy.orm import Session

from app.models.models import Rental, RentalStatus          # ← enum importado
from app.schemas.rental import RentalCreate
from app.core.config import settings


# ───────── helpers internos ───────────────────────────────────────────────
async def _fetch_item(item_id: int) -> dict:
    """
    Llama al micro‑servicio **Catalog** para obtener el ítem.
    Lanza HTTPError si no existe / 404.
    """
    url = f"{settings.CATALOG_API_BASE}/items/{item_id}"
    async with httpx.AsyncClient() as client:
        r = await client.get(url, timeout=5.0)
        r.raise_for_status()
        return r.json()


def _calc_deposit(hours: float, price: float) -> float:
    """
    Depósito = 120 % del coste estimado (redondeo a 2 decimales).
    """
    raw = Decimal(hours * price * 1.2)
    return float(raw.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


# ───────── CRUD público ───────────────────────────────────────────────────
async def create_rental(
    db: Session,
    renter_username: str,
    rent_in: RentalCreate,
) -> Rental:
    item = await _fetch_item(rent_in.item_id)            # -- HTTP → Catalog

    if not item["available"]:
        raise ValueError("Ítem no disponible")

    hours = (rent_in.end_at - rent_in.start_at).total_seconds() / 3600
    deposit = _calc_deposit(hours, item["price_per_h"])

    db_rental = Rental(
        renter_username=renter_username,
        deposit=deposit,
        status=RentalStatus.pending,                     # ← nuevo
        returned=False,                                  # compatibilidad
        **rent_in.model_dump(),
    )
    db.add(db_rental)
    db.commit()
    db.refresh(db_rental)
    return db_rental


def get_rental(db: Session, rental_id: int) -> Rental | None:
    return db.query(Rental).filter(Rental.id == rental_id).first()


def get_rentals_by_user(db: Session, username: str) -> List[Rental]:
    return db.query(Rental).filter(Rental.renter_username == username).all()


def mark_returned(db: Session, rental: Rental) -> Rental:
    rental.returned = True
    rental.status = RentalStatus.returned                # ← sincroniza estado
    db.commit()
    db.refresh(rental)
    return rental
