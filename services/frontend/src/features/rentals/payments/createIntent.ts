// src/features/payments/createIntent.ts
import { api } from "../../../api";

export async function createIntent(amount: number) {
  const { data } = await api.post("/payments/create-intent", { amount });
  return data as { client_secret: string };
}
