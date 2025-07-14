from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    FRONTEND_URL: str | None = None  # MODIFIED: Optional
    DATABASE_URL: str
    SECRET_KEY: str
    CATALOG_API_BASE: str           # p. ej. http://catalog:8000/api
    ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
