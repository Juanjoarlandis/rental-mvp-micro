"""Initial schema

Revision ID: 20250713_0001
Revises:
Create Date: 2025‑07‑13 12:00:00
"""
from alembic import op
import sqlalchemy as sa

# ──────────────────────────────
revision = "20250713_0001"
down_revision = None
branch_labels = None
depends_on = None
# ──────────────────────────────

def upgrade() -> None:
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String, nullable=False, unique=True, index=True),
    )

    op.create_table(
        "items",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("name", sa.String, nullable=False, index=True),
        sa.Column("description", sa.String),
        sa.Column("price_per_h", sa.Float, nullable=False),
        sa.Column("image_url", sa.String),
        sa.Column("owner_username", sa.String, nullable=False, index=True),
        sa.Column("available", sa.Boolean, server_default=sa.text("true"), nullable=False),
    )

    op.create_table(
        "item_images",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("item_id", sa.Integer, sa.ForeignKey("items.id", ondelete="CASCADE"), nullable=False),
        sa.Column("url", sa.String, nullable=False),
    )

    op.create_table(
        "item_categories",
        sa.Column("item_id", sa.Integer, sa.ForeignKey("items.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("category_id", sa.Integer, sa.ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True),
    )


def downgrade() -> None:
    op.drop_table("item_categories")
    op.drop_table("item_images")
    op.drop_table("items")
    op.drop_table("categories")
