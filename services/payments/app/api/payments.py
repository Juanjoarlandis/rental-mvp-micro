"""
Endpoints
---------
• POST /api/payments/create-intent   -> Frontend
• POST /api/stripe/webhook           -> Stripe
"""
from typing import Literal

import stripe
from fastapi import APIRouter, Header, HTTPException, Request
from pydantic import BaseModel, PositiveFloat

from app.core.config import settings

stripe.api_key = settings.secret_key

router = APIRouter()

# ───── Schemas ────────────────────────────────────────────────────────────
class CreateIntentIn(BaseModel):
    amount: PositiveFloat             # € que cobra el propietario


class CreateIntentOut(BaseModel):
    client_secret: str


EUR_FACTOR: Literal[100] = 100        # euros → céntimos

# ───── Endpoints ──────────────────────────────────────────────────────────
@router.post("/create-intent", response_model=CreateIntentOut)
def create_payment_intent(data: CreateIntentIn):
    """Devuelve el *client_secret* para que el Front confirme el pago."""
    intent = stripe.PaymentIntent.create(
        amount=int(data.amount * EUR_FACTOR),
        currency="eur",
        automatic_payment_methods={"enabled": True},
    )
    return {"client_secret": intent.client_secret}


@router.post("/stripe/webhook", status_code=200)
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="Stripe-Signature"),
):
    """
    Recibe eventos de Stripe, verifica la firma y despacha los handlers
    necesarios.  Siempre respondemos 2xx para que Stripe marque correcta
    la entrega.
    """
    payload = await request.body()

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=stripe_signature,
            secret=settings.STRIPE_WEBHOOK_SECRET,
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="invalid signature")

    if event["type"] == "payment_intent.succeeded":
        _handle_success(event["data"]["object"])
    elif event["type"] == "payment_intent.payment_failed":
        _handle_failure(event["data"]["object"])

    return {"received": True}


# ───── Internal handlers ─────────────────────────────────────────────────
def _handle_success(pi: dict):
    # Aquí actualizarías tu BD, enviaría emails, etc.
    print("✅ PaymentIntent succeeded:", pi["id"])


def _handle_failure(pi: dict):
    print("❌ PaymentIntent failed:", pi["id"])
