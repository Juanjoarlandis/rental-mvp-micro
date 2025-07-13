// src/features/rentals/createRental.ts
import { api } from "../../api";

/** Crea un alquiler y devuelve su objeto completo (`RentalOut`). */
export async function createRental(item_id: number,
                                   start_at: string,
                                   end_at: string) {
  const { data } = await api.post("/rentals/", { item_id, start_at, end_at });
  return data;                         // ← incluye `deposit`
}
