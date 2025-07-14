from sqlalchemy.orm import Session
from models.payment import Payment
from schemas.payment import PaymentCreate

def create(db: Session, payment_in: PaymentCreate, stripe_pi: str) -> Payment:
    p = Payment(**payment_in.model_dump(), stripe_pi=stripe_pi)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

def get_by_pi(db: Session, stripe_pi: str) -> Payment | None:
    return db.query(Payment).filter(Payment.stripe_pi == stripe_pi).first()

def capture(db: Session, payment: Payment) -> Payment:
    payment.captured = True
    db.commit()
    db.refresh(payment)
    return payment

def refund(db: Session, payment: Payment) -> Payment:
    payment.refunded = True
    db.commit()
    db.refresh(payment)
    return payment
