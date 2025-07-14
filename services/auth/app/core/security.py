# services/auth/app/core/security.py
from datetime import datetime, timedelta
from jose import jwt, JWTError

from app.core.config import settings

# ───────── JWT genérico ──────────────────────────────────────────
def _encode(payload: dict, minutes: int) -> str:
    exp = datetime.utcnow() + timedelta(minutes=minutes)
    payload.update({"exp": exp})
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


# ───────── Access token (igual) ─────────────────────────────────
def create_access_token(subject: str) -> str:
    return _encode({"sub": subject}, settings.ACCESS_TOKEN_EXPIRE_MINUTES)


# ───────── Reset‑password token ────────────────────────────────
RESET_TOKEN_MINUTES = 15     # caduca rápido

def create_reset_token(username: str) -> str:
    return _encode({"sub": username, "scope": "pwd_reset"}, RESET_TOKEN_MINUTES)


def verify_reset_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("scope") != "pwd_reset":
            return None
        return payload.get("sub")
    except JWTError:
        return None
