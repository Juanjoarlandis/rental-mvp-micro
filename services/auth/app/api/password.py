# services/auth/app/api/password.py
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,      # 👈 necesario para slowapi
    status,
)
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.deps import get_db
from app.core.security import create_reset_token, verify_reset_token
from app.crud import user as crud
from app.core.ratelimit import limiter

router = APIRouter(tags=["password"])

# ───────── forgotten ────────────────────────────────────────────
class ForgotIn(BaseModel):
    username: str = Field(..., min_length=3)


class ForgotOut(BaseModel):
    reset_token: str


@router.post("/password/forgot", response_model=ForgotOut)
@limiter.limit("3/minute")
def forgot(
    request: Request,           # 👈 obligatorio
    data: ForgotIn,
    db: Session = Depends(get_db),
):
    user = crud.get_user_by_username(db, data.username)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Usuario no encontrado")
    token = create_reset_token(user.username)
    # MVP → devolvemos el token; en prod se enviaría por email
    return {"reset_token": token}


# ───────── reset ────────────────────────────────────────────────
class ResetIn(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


@router.post("/password/reset", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("3/minute")
def reset(
    request: Request,           # 👈 obligatorio
    data: ResetIn,
    db: Session = Depends(get_db),
):
    username = verify_reset_token(data.token)
    if not username:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Token inválido o expirado")

    user = crud.get_user_by_username(db, username)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Usuario no encontrado")

    # actualiza hash
    user.hashed_pw = crud.pwd_context.hash(data.new_password)
    db.commit()
