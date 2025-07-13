# services/payments/app/schemas/payment.py
from datetime import datetime
from pydantic import BaseModel, PositiveFloat, ConfigDict


class PaymentCreate(BaseModel):
    rental_id: int
    owner_id: int            # propietario (Stripe Connect)
    amount: PositiveFloat
    currency: str = "eur"


class PaymentOut(BaseModel):
    id: int
    rental_id: int
    amount: float
    currency: str
    captured: bool
    refunded: bool
    stripe_pi: str
    created_at: datetime

    # Pydantic v2
    model_config = ConfigDict(from_attributes=True)
