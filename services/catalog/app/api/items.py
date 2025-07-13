from typing import List, Optional
from urllib.parse import urlencode

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Request,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app import crud, schemas
from app.deps import get_db, get_current_username

router = APIRouter()

# ───────── helpers paginación RFC-5988 ────────────────────────────────────
def _pagination_links(request: Request, skip: int, limit: int, total: int, **flt):
    links: list[str] = []
    base = request.url.remove_query_params("skip").remove_query_params("limit")

    def _url(new_skip: int):
        params = {k: v for k, v in flt.items() if v is not None}
        params.update({"skip": new_skip, "limit": limit})
        return f"<{base}?{urlencode(params, doseq=True)}>"

    if skip + limit < total:
        links.append(f'{_url(skip + limit)}; rel="next"')
    if skip > 0:
        links.append(f'{_url(max(skip - limit,0))}; rel="prev"')
    return ", ".join(links)


# ───────────── crear ─────────────────────────────────────────────────────
@router.post("/", response_model=schemas.ItemOut, status_code=status.HTTP_201_CREATED)
def create_item(
    item_in: schemas.ItemCreate,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_username),
):
    return crud.create_item(db, item_in, owner_username=username)


# ───────────── listar público ────────────────────────────────────────────
@router.get("/", response_model=List[schemas.ItemOut])
def list_items(
    request: Request,
    response: Response,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    name: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    available: Optional[bool] = None,
    categories: Optional[List[int]] = Query(None),
    order_by: Optional[str] = Query(None, pattern="^(price|name|id)$"),
    order_dir: Optional[str] = Query(None, pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    items, total = crud.get_items(
        db,
        skip,
        limit,
        name=name,
        min_price=min_price,
        max_price=max_price,
        available=available,
        categories=categories,
        order_by=order_by,
        order_dir=order_dir,
    )
    response.headers["X-Total-Count"] = str(total)
    if total:
        link = _pagination_links(
            request,
            skip,
            limit,
            total,
            name=name,
            min_price=min_price,
            max_price=max_price,
            available=available,
            categories=categories,
            order_by=order_by,
            order_dir=order_dir,
        )
        if link:
            response.headers["Link"] = link
    return items


# ───────────── mis ítems ────────────────────────────────────────────────
@router.get("/me", response_model=List[schemas.ItemOut])
def my_items(
    db: Session = Depends(get_db),
    username: str = Depends(get_current_username),
):
    return crud.get_items_by_owner(db, username)


# ───────────── actualizar ───────────────────────────────────────────────
@router.patch("/{item_id}", response_model=schemas.ItemOut)
def patch_item(
    item_id: int,
    item_in: schemas.ItemUpdate,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_username),
):
    db_item = crud.get_item(db, item_id)
    if not db_item or db_item.owner_username != username:
        raise HTTPException(404, "Item no encontrado")
    return crud.update_item(db, db_item, item_in)


@router.put("/{item_id}", response_model=schemas.ItemOut)
def put_item(
    item_id: int,
    item_in: schemas.ItemCreate,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_username),
):
    db_item = crud.get_item(db, item_id)
    if not db_item or db_item.owner_username != username:
        raise HTTPException(404, "Item no encontrado")
    return crud.update_item(db, db_item, schemas.ItemUpdate(**item_in.model_dump()))

# ───────────── obtener 1 ítem ────────────────────────────────────────────
@router.get("/{item_id}", response_model=schemas.ItemOut)
def get_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    """
    Devuelve un único ítem por *ID*.

    404 si no existe.
    """
    db_item = crud.get_item(db, item_id)
    if not db_item:
        raise HTTPException(404, "Item no encontrado")
    return db_item



# ───────────── eliminar ────────────────────────────────────────────────
@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_username),
):
    db_item = crud.get_item(db, item_id)
    if not db_item or db_item.owner_username != username:
        raise HTTPException(404, "Item no encontrado")
    crud.delete_item(db, db_item)