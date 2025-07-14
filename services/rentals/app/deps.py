from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.models.database import SessionLocal
from app.core.config import settings

# ───────── DB
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ───────── JWT – solo extraemos el username
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="dummy")


def get_current_username(token: str = Depends(oauth2_scheme)) -> str:
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales no válidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        sub: str | None = payload.get("sub")
        if not sub:
            raise cred_exc
        return sub
    except JWTError as e:  # MODIFIED: Granular
        detail = "Token expirado" if "exp" in str(e) else "Token inválido"
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail)