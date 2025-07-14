# services/auth/app/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.models.database import SessionLocal
from app.core.config import settings
from app.crud import user as crud
from app.schemas.user import UserOut

# ──────────── DB session ────────────
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ──────────── Auth helper ───────────
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/token"   # el prefijo '/api/auth' se añade en main.py
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> UserOut:
    """
    Valida el JWT y devuelve el usuario asociado.
    Lanza 401 si es inválido o no existe.
    """
    # MODIFIED: Mejora - Añadido manejo de expiración y scopes si aplica
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales no válidas",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str | None = payload.get("sub")
        if not username:
            raise cred_exc
    except JWTError as e:  # MODIFIED: Más granular (expirado, inválido)
        detail = "Token expirado" if "exp" in str(e) else "Token inválido"
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail)

    user = crud.get_user_by_username(db, username)
    if not user:
        raise cred_exc
    return user