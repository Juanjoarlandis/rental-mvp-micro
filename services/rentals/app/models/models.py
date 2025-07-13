# services/rentals/app/models/models.py
from __future__ import annotations

import datetime
import enum
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    Integer,
    String,
)

from app.models.database import Base


class RentalStatus(str, enum.Enum):
    pending = "pending"      # reserva creada, a la espera de pagar
    confirmed = "confirmed"  # fianza retenida
    returned = "returned"    # ítem devuelto y cargo capturado


class Rental(Base):
    __tablename__ = "rentals"

    id = Column(Integer, primary_key=True)
    item_id = Column(Integer, nullable=False, index=True)
    renter_username = Column(String, nullable=False, index=True)

    start_at = Column(DateTime, default=datetime.datetime.utcnow)
    end_at = Column(DateTime)

    deposit = Column(Float, nullable=False)

    # --- nuevos campos ---
    status = Column(
        Enum(RentalStatus, name="rental_status"),
        default=RentalStatus.pending,
        nullable=False,
    )
    returned = Column(Boolean, default=False)  # compatibilidad legado
