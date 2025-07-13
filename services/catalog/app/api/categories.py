from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.deps import get_db, get_current_username

router = APIRouter()


@router.get("/", response_model=List[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)


@router.post(
    "/", response_model=schemas.CategoryOut, status_code=status.HTTP_201_CREATED
)
def create_category(
    cat_in: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    _user=Depends(get_current_username),        # solo autenticados
):
    return crud.create_category(db, cat_in)


@router.get("/{cat_id}", response_model=schemas.CategoryOut)
def get_category(cat_id: int, db: Session = Depends(get_db)):
    cat = crud.get_category(db, cat_id)
    if not cat:
        raise HTTPException(404, "Categoría no encontrada")
    return cat