"""Initial schema

Revision ID: 20250713_0001
Revises: 
Create Date: 2025-07-13 10:15:00
"""
from alembic import op
import sqlalchemy as sa


# ────────────── Identificación ──────────────
revision: str = "20250713_0001"
down_revision: str | None = None
branch_labels: tuple | None = None
depends_on: tuple | None = None


# ────────────── Upgrade ──────────────
def upgrade() -> None:
    # categories
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=50), nullable=False, unique=True, index=True),
    )

    # items
    op.create_table(
        "items",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("name", sa.String(length=80), nullable=False, index=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("price_per_h", sa.Float(), nullable=False),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("owner_username", sa.String(), nullable=False, index=True),
        sa.Column("available", sa.Boolean(), server_default=sa.true(), nullable=False),
    )

    # item_images
    op.create_table(
        "item_images",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("item_id", sa.Integer(), sa.ForeignKey("items.id", ondelete="CASCADE"), nullable=False),
        sa.Column("url", sa.String(), nullable=False),
    )

    # asociación N:M items ↔ categories
    op.create_table(
        "item_categories",
        sa.Column("item_id", sa.Integer(), sa.ForeignKey("items.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True),
    )


# ────────────── Downgrade ──────────────
def downgrade() -> None:
    op.drop_table("item_categories")
    op.drop_table("item_images")
    op.drop_table("items")
    op.drop_table("categories")
