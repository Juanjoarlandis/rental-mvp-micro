/**
 * Orquesta todo el flujo:
 *   1) crea un alquiler              → /api/rentals/
 *   2) pide PaymentIntent a Stripe   → /api/payments/create-intent
 * Devuelve el `client_secret` para confirmar el pago desde el front.
 */
import { api } from "../../api";

export async function reserve(item_id: number) {
  // demo: 1 h desde ahora
  const start_at = new Date().toISOString();
  const end_at   = new Date(Date.now() + 3_600_000).toISOString();

  // 1) crear alquiler
  const { data: rental } = await api.post("/rentals/", {
    item_id,
    start_at,
    end_at
  });

  // 2) crear PaymentIntent (fianza = rental.deposit)
  const { data: intent } = await api.post("/payments/create-intent", {
    amount: rental.deposit
  });

  return { clientSecret: intent.client_secret, rental };
}
