"""
Pequeña capa de ayuda sobre el SDK oficial de Stripe.
"""
from decimal import Decimal, ROUND_HALF_UP
from typing import Literal

import stripe

from app.core.config import settings

stripe.api_key = settings.secret_key

Currency = Literal["eur", "usd"]


def _percentage(amount: int, pct: int) -> int:
    """
    Devuelve `pct` % de `amount` redondeado al céntimo.
    Ambos valores en céntimos (enteros).
    """
    return int(
        (Decimal(amount) * Decimal(pct) / Decimal(100)).quantize(
            Decimal("1"), rounding=ROUND_HALF_UP
        )
    )


def calc_app_fee(amount_cents: int) -> int:
    """Comisión de la plataforma en **céntimos**."""
    return _percentage(amount_cents, settings.PLATFORM_FEE_PERCENT)


def create_payment_intent(
    amount_cents: int,
    currency: Currency,
    customer_id: str | None,
    connected_account: str,
) -> stripe.PaymentIntent:
    """
    Crea un PaymentIntent *manual-capture* para un vendedor de Stripe Connect,
    reteniendo la comisión de la plataforma.
    """
    return stripe.PaymentIntent.create(
        amount=amount_cents,
        currency=currency,
        payment_method_types=["card"],
        customer=customer_id,
        capture_method="manual",
        application_fee_amount=calc_app_fee(amount_cents),
        on_behalf_of=connected_account,
        transfer_data={"destination": connected_account},
    )
