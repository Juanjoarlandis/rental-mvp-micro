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
    ALLOWED_ORIGINS: str = ""                  # lista separada por comas

    # ───── BD (opcional) ─────────────────────────────────────────────────
    DATABASE_URL: str | None = None

    # lee .env y omite claves extra
    model_config = {"env_file": ".env", "extra": "ignore"}

    # ──────────────────────────────────────────────────────────────────────
    #  Acceso unificado a la clave secreta
    # ──────────────────────────────────────────────────────────────────────
    @cached_property
    def secret_key(self) -> str:
        """
        Devuelve la clave secreta de Stripe sin importar el nombre de la
        variable.  STRIPE_SECRET_KEY tiene prioridad sobre STRIPE_API_KEY.
        """
        key = self.STRIPE_SECRET_KEY or self.STRIPE_API_KEY
        if not key:
            raise RuntimeError(
                "Debes definir STRIPE_SECRET_KEY o STRIPE_API_KEY en el entorno"
            )
        return key


settings = Settings()
