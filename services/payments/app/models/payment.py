from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from models.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    rental_id = Column(Integer, nullable=False)            # id proveniente del microservicio rentals
    user_id   = Column(Integer, nullable=False)            # quién paga (renter)
    owner_id  = Column(Integer, nullable=False)            # propietario del ítem (cobra)
    amount    = Column(Float, nullable=False)              # € totales
    currency  = Column(String(3), default="eur")
    stripe_pi = Column(String, nullable=False, unique=True)  # PaymentIntent id
    refunded  = Column(Boolean, default=False)
    captured  = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
