# services/rentals/app/models/models.py
from __future__ import annotations

import datetime
import enum
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    Integer,
    String,
)
from sqlalchemy.dialects import postgresql

from app.models.database import Base


class RentalStatus(str, enum.Enum):
    pending   = "pending"
    confirmed = "confirmed"
    returned  = "returned"


class Rental(Base):
    __tablename__ = "rentals"

    id = Column(Integer, primary_key=True)
    item_id = Column(Integer, nullable=False, index=True)
    renter_username = Column(String, nullable=False, index=True)

    start_at = Column(DateTime, default=datetime.datetime.utcnow)
    end_at   = Column(DateTime)

    deposit = Column(Float, nullable=False)

    status = Column(
        postgresql.ENUM(
            RentalStatus,
            name="rental_status",
            create_type=False          # ← usa el TYPE ya existente
        ),
        default=RentalStatus.pending,
        nullable=False,
    )
    returned = Column(Boolean, default=False)
