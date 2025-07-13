"""Inicial – tabla rentals

Revision ID: 20250714_0001
Revises:
Create Date: 2025-07-14 00:15:00
"""
from alembic import op
import sqlalchemy as sa

# ─────────── Meta ───────────
revision: str = "20250714_0001"
down_revision: str | None = None
branch_labels: tuple | None = None
depends_on: tuple | None = None


# ─────────── Upgrade ────────
def upgrade() -> None:
    op.create_table(
        "rentals",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("item_id", sa.Integer(), nullable=False),
        sa.Column("renter_username", sa.String(), nullable=False),
        sa.Column("start_at", sa.DateTime(), nullable=False),
        sa.Column("end_at", sa.DateTime(), nullable=False),
        sa.Column("deposit", sa.Float(), nullable=False),
        sa.Column("returned", sa.Boolean(), server_default=sa.false(), nullable=False),
    )
    op.create_index("ix_rentals_item_id", "rentals", ["item_id"])
    op.create_index("ix_rentals_renter_username", "rentals", ["renter_username"])


# ─────────── Downgrade ──────
def downgrade() -> None:
    op.drop_index("ix_rentals_renter_username", table_name="rentals")
    op.drop_index("ix_rentals_item_id", table_name="rentals")
    op.drop_table("rentals")
