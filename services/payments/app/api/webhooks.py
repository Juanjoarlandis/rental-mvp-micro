"""
Recibe eventos de Stripe (webhook) y sincroniza estado interno.
"""
import stripe
from fastapi import APIRouter, Header, HTTPException, Request, Depends, status
from sqlalchemy.orm import Session

from core.config import settings  # FIX: Quita 'app.'
from crud import get_by_pi, capture, refund  # FIX: Quita 'app.', importa directo
from deps import get_db  # FIX: Quita 'app.'

router = APIRouter()

@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="Stripe-Signature"),
    db: Session = Depends(get_db),
):
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Firma inválida")

    if event.type == "payment_intent.succeeded":
        pi = event.data.object
        p = get_by_pi(db, pi["id"])
        if p and not p.captured:
            capture(db, p)

    elif event.type == "charge.refunded":
        ch = event.data.object
        pi_id = ch["payment_intent"]
        p = get_by_pi(db, pi_id)
        if p and not p.refunded:
            refund(db, p)

    return {"received": True}