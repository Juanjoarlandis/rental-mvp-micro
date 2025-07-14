from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="dummy")   # solo validamos

def get_current_username(
    token: str = Depends(oauth2_scheme)
) -> str:
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
        return username
    except JWTError as e:  # MODIFIED: Granular
        detail = "Token expirado" if "exp" in str(e) else "Token inválido"
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail)