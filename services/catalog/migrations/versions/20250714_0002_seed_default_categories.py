"""Seed default categories

Revision ID: 20250714_0002
Revises: 20250713_0001
Create Date: 2025‑07‑14 12:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = "20250714_0002"
down_revision = "20250713_0001"
branch_labels = None
depends_on = None

DEFAULT_CATEGORIES = [
    "Herramientas",
    "Electrónica",
    "Deportes",
    "Hogar",
    "Jardín",
    "Fotografía",
    "Camping",
    "Infantil",
]


def upgrade() -> None:
    categories = sa.table("categories", sa.column("name", sa.String))
    conn = op.get_bind()

    existing = {row.name for row in conn.execute(sa.select(categories.c.name))}
    to_insert = [{"name": n} for n in DEFAULT_CATEGORIES if n not in existing]

    if to_insert:
        op.bulk_insert(categories, to_insert)


def downgrade() -> None:
    op.execute(
        sa.text("DELETE FROM categories WHERE name = ANY(:names)"),
        {"names": DEFAULT_CATEGORIES},
    )
