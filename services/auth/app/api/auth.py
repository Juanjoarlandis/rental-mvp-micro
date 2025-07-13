# services/auth/app/api/auth.py  (versión corregida y completa)
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.deps import get_db, get_current_user
from app.crud import user as crud
from app.schemas.user import UserCreate, UserOut
from app.schemas.token import Token
from app.core.security import create_access_token

router = APIRouter(tags=["auth"])        # ← ¡sin prefix aquí!


# ───────────────────────────  SIGN-UP  ────────────────────────────
@router.post(
    "/signup",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario.

    • 409 si el **username** o el **email** ya existen.
    """
    try:
        return crud.create_user(db, user_in)
    except IntegrityError:
        db.rollback()
        # comprobamos cuál de las dos claves únicas falló para un mensaje claro
        detail = (
            "Nombre de usuario en uso"
            if crud.get_user_by_username(db, user_in.username)
            else "Email ya registrado"
        )
        raise HTTPException(status.HTTP_409_CONFLICT, detail=detail)


# ───────────────────────────  LOGIN  ──────────────────────────────
@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Intercambia usuario/contraseña por un JWT (password-grant).

    • 401 si las credenciales no son válidas.
    """
    user = crud.get_user_by_username(db, form_data.username)
    if not user or not crud.verify_password(form_data.password, user.hashed_pw):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.username)
    return {"access_token": access_token, "token_type": "bearer"}


# ───────────────────────────  WHO AM I?  ─────────────────────────
@router.get("/users/me", response_model=UserOut)
def read_users_me(current_user: UserOut = Depends(get_current_user)):
    """Devuelve **id, username y email** asociados al token actual."""
    return current_user


# alias corto opcional
router.get("/me", response_model=UserOut)(read_users_me)
