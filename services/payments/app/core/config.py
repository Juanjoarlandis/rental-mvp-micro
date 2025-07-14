from functools import cached_property
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ───── Stripe ──────────────────────────────────────────────────────────
    STRIPE_SECRET_KEY: str | None = None       # nombre habitual
    STRIPE_API_KEY:    str | None = None       # alias heredado
    STRIPE_PUBLISHABLE_KEY: str
    STRIPE_WEBHOOK_SECRET:  str

    # ───── Servicio ───────────────────────────────────────────────────────
    PLATFORM_FEE_PERCENT: int = 8              # comisión % de la plataforma
    DOMAIN: str = "http://localhost:8005"

    # ───── CORS ───────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: str = ""  # Cambiado a str, comma-separated

    # ───── BD (opcional) ─────────────────────────────────────────────────
    DATABASE_URL: str | None = None

    # FIX: Añadido para Pydantic v2 compat
    model_config = {"env_file": ".env", "extra": "ignore"}

    # ───── Property para splitear ─────────────────────────────────────────
    @cached_property
    def allowed_origins(self) -> list[str]:
        try:
            if not self.ALLOWED_ORIGINS:
                return []
            return [o.strip() for o in self.ALLOWED_ORIGINS.split(',') if o.strip()]
        except Exception as e:
            raise ValueError(f"Error parsing ALLOWED_ORIGINS: {e}") from e

    # ───── Acceso unificado a secret_key ──────────────────────────────────
    @cached_property
    def secret_key(self) -> str:
        key = self.STRIPE_SECRET_KEY or self.STRIPE_API_KEY
        if not key:
            raise RuntimeError(
                "Debes definir STRIPE_SECRET_KEY o STRIPE_API_KEY en el entorno"
            )
        return key


settings = Settings()