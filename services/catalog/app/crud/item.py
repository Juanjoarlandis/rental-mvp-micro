from __future__ import annotations

from typing import List, Optional, Tuple

from sqlalchemy import asc, desc, or_
from sqlalchemy.orm import Session, joinedload

from app.models.models import Category, Item, ItemImage
from app.schemas.item import ItemCreate, ItemUpdate

# ───────── helpers internos ───────────────────────────────────────────────
def _get_categories_or_400(db: Session, ids: list[int]) -> list[Category]:
    cats = db.query(Category).filter(Category.id.in_(ids)).all()
    if len(cats) != len(ids):
        missing = set(ids) - {c.id for c in cats}
        raise ValueError(f"Categorías inexistentes: {', '.join(map(str, missing))}")
    return cats


def _apply_order(q, order_by: str | None, order_dir: str | None):
    mapping = {"price": Item.price_per_h, "name": Item.name, "id": Item.id}
    if not order_by:
        return q.order_by(Item.id)
    col = mapping.get(order_by, Item.id)
    return q.order_by(asc(col) if order_dir == "asc" else desc(col))


# ───────── lectura ────────────────────────────────────────────────────────
def get_item(db: Session, item_id: int) -> Optional[Item]:
    return (
        db.query(Item)
        .options(joinedload(Item.categories), joinedload(Item.images))
        .filter(Item.id == item_id)
        .first()
    )


def _build_query(
    db: Session,
    *,
    name: Optional[str],
    min_price: Optional[float],
    max_price: Optional[float],
    available: Optional[bool],
    categories: Optional[List[int]],
    order_by: Optional[str],
    order_dir: Optional[str],
):
    q = db.query(Item).options(joinedload(Item.categories), joinedload(Item.images))

    if name:
        pattern = f"%{name}%"
        q = q.filter(or_(Item.name.ilike(pattern), Item.description.ilike(pattern)))
    if min_price is not None:
        q = q.filter(Item.price_per_h >= min_price)
    if max_price is not None:
        q = q.filter(Item.price_per_h <= max_price)
    if available is not None:
        q = q.filter(Item.available == available)
    if categories:
        q = q.filter(Item.categories.any(Category.id.in_(categories)))

    return _apply_order(q, order_by, order_dir)


def get_items(
    db: Session,
    skip: int,
    limit: int,
    *,
    name: Optional[str],
    min_price: Optional[float],
    max_price: Optional[float],
    available: Optional[bool],
    categories: Optional[List[int]],
    order_by: Optional[str],
    order_dir: Optional[str],
) -> Tuple[List[Item], int]:
    q = _build_query(
        db,
        name=name,
        min_price=min_price,
        max_price=max_price,
        available=available,
        categories=categories,
        order_by=order_by,
        order_dir=order_dir,
    )
    total = q.count()
    items = q.offset(skip).limit(limit).all()
    return items, total


def get_items_by_owner(db: Session, owner: str) -> List[Item]:
    return (
        db.query(Item)
        .options(joinedload(Item.categories), joinedload(Item.images))
        .filter(Item.owner_username == owner)
        .all()
    )


# ───────── escritura ──────────────────────────────────────────────────────
def create_item(db: Session, item_in: ItemCreate, owner_username: str) -> Item:
    main = str(item_in.image_urls[0])

    db_item = Item(
        name=item_in.name,
        description=item_in.description,
        price_per_h=item_in.price_per_h,
        image_url=main,
        owner_username=owner_username,
    )

    if item_in.categories:
        db_item.categories = _get_categories_or_400(db, item_in.categories)

    db_item.images = [ItemImage(url=str(u)) for u in item_in.image_urls]

    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_item(db: Session, db_item: Item, item_in: ItemUpdate) -> Item:
    data = item_in.model_dump(exclude_unset=True, exclude={"categories", "image_urls"})
    for k, v in data.items():
        setattr(db_item, k, v)

    if item_in.categories is not None:
        db_item.categories = _get_categories_or_400(db, item_in.categories)

    if item_in.image_urls is not None:
        db_item.image_url = str(item_in.image_urls[0])
        db_item.images = [ItemImage(url=str(u)) for u in item_in.image_urls]

    db.commit()
    db.refresh(db_item)
    return db_item


def delete_item(db: Session, db_item: Item) -> None:
    db.delete(db_item)
    db.commit()