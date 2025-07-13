"""Inicial – tabla rentals

Revision ID: 20250714_0001
Revises:
Create Date: 2025‑07‑14 00:15:00
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# ─────────── Meta ───────────
revision: str = "20250714_0001"
down_revision: str | None = None
branch_labels: tuple | None = None
depends_on: tuple | None = None


# ─────────── Upgrade ────────
def upgrade() -> None:
    rental_status = postgresql.ENUM(
        "pending", "confirmed", "returned",
        name="rental_status",
    )
    rental_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "rentals",
        sa.Column("id", sa.Integer(), primary_key=True),

        sa.Column("item_id", sa.Integer(), index=True, nullable=False),
        sa.Column("renter_username", sa.String(), index=True, nullable=False),

        sa.Column("start_at", sa.DateTime(), nullable=False),
        sa.Column("end_at",   sa.DateTime(), nullable=False),

        sa.Column("deposit", sa.Float(), nullable=False),

        sa.Column(
            "status",
            postgresql.ENUM(
                "pending", "confirmed", "returned",
                name="rental_status",
                create_type=False,
            ),
            nullable=False,
            server_default="pending",
        ),

        sa.Column(
            "returned",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )


# ─────────── Downgrade ──────
def downgrade() -> None:
    op.drop_table("rentals")

    rental_status = postgresql.ENUM(name="rental_status")
    rental_status.drop(op.get_bind(), checkfirst=True)
