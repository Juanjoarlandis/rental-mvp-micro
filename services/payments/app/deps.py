import stripe
from fastapi import Header, HTTPException

from app.core.config import settings

stripe.api_key = settings.secret_key


def get_stripe():
    """Devuelve el cliente Stripe configurado (inyección de dependencias)."""
    return stripe


def verify_webhook(
    stripe_signature: str | None = Header(None, alias="Stripe-Signature"),
    payload: bytes | None = None,
):
    """
    Verifica la firma del webhook usando la secret generada con
    `stripe listen`.  Lanza 400 si la firma es inválida.
    """
    if payload is None:
        raise HTTPException(status_code=400, detail="body empty")

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=stripe_signature,
            secret=settings.STRIPE_WEBHOOK_SECRET,
        )
        return event
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="invalid signature")
