"""
Fixtures globales para los tests del micro‑servicio Auth
– BD SQLite in‑memory compartida
– Override de get_db
– TestClient
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Generator

# ────── variables de entorno (antes de importar la app) ──────
os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ.setdefault("SECRET_KEY", "TEST_SECRET")

# ────── añadir services/auth al PYTHONPATH del runner ──────
PROJECT_ROOT = Path(__file__).resolve().parents[2]          # rental-mvp-micro/
AUTH_PATH = PROJECT_ROOT / "services" / "auth"
sys.path.insert(0, str(AUTH_PATH)) if str(AUTH_PATH) not in sys.path else None

# ────── imports de la app (ya con env preparado) ──────
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool                     #  ⭐️

from app.main import app
from app.deps import get_db
from app.core.ratelimit import limiter
from app.models.database import Base

# ────── motor y sesión para la BD de pruebas ──────
engine = create_engine(
    os.environ["DATABASE_URL"],
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,            #  👈 comparte la misma conexión
)
TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base.metadata.create_all(bind=engine)       # crea todas las tablas una vez


def override_get_db() -> Generator:
    db = TestingSessionLocal()
    try:
        yield db
        db.commit()
    finally:
        db.close()


# sustituimos la dependencia real por la de pruebas
app.dependency_overrides[get_db] = override_get_db
limiter.enabled = False        # sin límites en los tests excepto cuando se active explícitamente


# ────── cliente de prueba para cada test ──────
@pytest.fixture()
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c
