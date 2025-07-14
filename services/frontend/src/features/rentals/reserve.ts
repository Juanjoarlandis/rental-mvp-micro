/**
 * Orquesta todo el flujo:
 *   1) crea un alquiler              → /api/rentals/
 *   2) pide PaymentIntent a Stripe   → /api/payments/create-intent
 * Devuelve el `client_secret` para confirmar el pago desde el front.
 */
import { api } from "../../api";

// ### UPDATED: Acepta fechas reales
export async function reserve(item_id: number, start: Date, end: Date) {
  const start_at = start.toISOString();
  const end_at = end.toISOString();

  // 1) crear alquiler con fechas
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