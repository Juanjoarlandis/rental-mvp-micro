"""Amplía tabla items con campos avanzados

Revision ID: 20250715_0003
Revises    : 20250714_0002
Create Date: 2025‑07‑15 09:00:00
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20250715_0003"
down_revision = "20250714_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("items") as batch:
        batch.add_column(sa.Column("compare_at_price", sa.Float))
        batch.add_column(sa.Column("sku", sa.String(), unique=True))
        batch.add_column(sa.Column("stock", sa.Integer(), nullable=False, server_default="1"))
        batch.add_column(sa.Column("weight_kg", sa.Float))
        batch.add_column(sa.Column("shipping_type", sa.String(length=20), nullable=False, server_default="free"))
        batch.add_column(sa.Column("condition", sa.String(length=10), nullable=False, server_default="new"))
        batch.add_column(sa.Column("hashtags", postgresql.ARRAY(sa.String)))


def downgrade() -> None:
    with op.batch_alter_table("items") as batch:
        batch.drop_column("hashtags")
        batch.drop_column("condition")
        batch.drop_column("shipping_type")
        batch.drop_column("weight_kg")
        batch.drop_column("stock")
        batch.drop_column("sku")
        batch.drop_column("compare_at_price")
