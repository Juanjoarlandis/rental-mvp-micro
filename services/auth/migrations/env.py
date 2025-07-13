# migrations/env.py
"""Alembic migration environment for the Auth service."""

from __future__ import annotations

from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# ────────────────────────────────────────────────────────
# 1. Configuración y logging
# ────────────────────────────────────────────────────────
config = context.config
fileConfig(config.config_file_name)

# ────────────────────────────────────────────────────────
# 2. Metadata de modelos  → autogenerate
# ────────────────────────────────────────────────────────
from app.models.models import Base  # importa las tablas
target_metadata = Base.metadata

# (opcional, pero aconsejado: convenciones de nombres)
target_metadata.naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

# ────────────────────────────────────────────────────────
# 3. URL de conexión: utiliza la misma que tu servicio
# ────────────────────────────────────────────────────────
from app.core.config import settings  # noqa: E402

config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# ────────────────────────────────────────────────────────
# 4. Hooks offline / online
# ────────────────────────────────────────────────────────
def run_migrations_offline() -> None:
    """Genera SQL sin tocar la BD (alembic upgrade --sql)."""
    context.configure(
        url=config.get_main_option("sqlalchemy.url"),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Aplica las migraciones sobre la BD."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
