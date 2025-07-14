from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.deps import get_db, get_current_username

router = APIRouter()


# ────────────── crear alquiler ────────────────────────────────────────────
@router.post(
    "/",
    response_model=schemas.RentalOut,
    status_code=status.HTTP_201_CREATED,
)
async def rent_item(
    rent_in: schemas.RentalCreate,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_username),
):
    try:
        rental = await crud.create_rental(db, username, rent_in)
    except ValueError as exc:
        raise HTTPException(400, str(exc))
    return await _with_item(rental)


# ────────────── lista del usuario ─────────────────────────────────────────
@router.get("/me", response_model=List[schemas.RentalOut])
async def my_rentals(
    db: Session = Depends(get_db),
    username: str = Depends(get_current_username),
):
    rentals = crud.get_rentals_by_user(db, username)
    return [await _with_item(r) for r in rentals]


# ────────────── devolución ────────────────────────────────────────────────
@router.post("/{rental_id}/return", response_model=schemas.RentalOut)
async def return_item(
    rental_id: int,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_username),
):
    rental = crud.get_rental(db, rental_id)
    if not rental or rental.renter_username != username:
        raise HTTPException(404, "Alquiler no encontrado")
    rental = crud.mark_returned(db, rental)
    return await _with_item(rental)


# ────────────── ### NEW: Disponibilidad de un ítem ─────────────────────────
@router.get("/item/{item_id}/availability", response_model=List[schemas.DateRange])
async def get_item_availability(
    item_id: int,
    db: Session = Depends(get_db),
):
    """
    Devuelve rangos ocupados para un ítem (para calendario frontend).
    Solo rangos activos (no returned).
    """
    return crud.get_occupied_ranges(db, item_id)


# ────────────── helper común ──────────────────────────────────────────────
import httpx
from app.core.config import settings
from app.schemas.rental import ItemSnapshot


async def _with_item(rental) -> schemas.RentalOut:
    """
    Añade el snapshot del item a la salida para que el front no
    necesite hacer otra llamada.
    """
    url = f"{settings.CATALOG_API_BASE}/items/{rental.item_id}"
    async with httpx.AsyncClient() as client:
        item_json = {}
        try:
            r = await client.get(url, timeout=5.0)
            if r.status_code == 200:
                item_json = r.json()
        except httpx.HTTPError:
            pass

    return schemas.RentalOut(
        **rental.__dict__,
        item=ItemSnapshot(**item_json) if item_json else ItemSnapshot(
            id=rental.item_id,
            name="Desconocido",
            price_per_h=0,
        ),
    )