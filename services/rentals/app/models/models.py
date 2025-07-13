import enum
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Enum
# …

class RentalStatus(str, enum.Enum):
    pending   = "pending"     # reserva creada, a la espera de pagar la fianza
    confirmed = "confirmed"   # fianza retenida correctamente (tu “pagado”)
    returned  = "returned"    # ítem devuelto, cargo capturado

class Rental(Base):
    __tablename__ = "rentals"

    id              = Column(Integer, primary_key=True)
    item_id         = Column(Integer, nullable=False, index=True)
    renter_username = Column(String,  nullable=False, index=True)
    start_at        = Column(DateTime, default=datetime.datetime.utcnow)
    end_at          = Column(DateTime)
    deposit         = Column(Float, nullable=False)

    # --- nuevo ---
    status          = Column(
        Enum(RentalStatus, name="rental_status"),
        default=RentalStatus.pending,
        nullable=False,
    )
