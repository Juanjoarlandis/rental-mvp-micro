// src/features/rentals/useRentals.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import { Item } from "../items/useItems";

/* ------------------------------------------------------------------ */
/*                              Types                                 */
/* ------------------------------------------------------------------ */

export type RentalStatus = "pending" | "confirmed" | "returned";

export type Rental = {
  id: number;
  item: Item;
  start_at: string;
  end_at: string;
  deposit: number;
  status: RentalStatus;       // ← reemplaza a «returned»
};

/* ------------------------------------------------------------------ */
/*                               Hook                                 */
/* ------------------------------------------------------------------ */

/**
 * Devuelve los alquileres del usuario autenticado.
 * La petición solo se dispara cuando `token` es truthy.
 */
export function useRentals(token: string | null) {
  const enabled = Boolean(token);

  const { data, isLoading, refetch } = useQuery<Rental[]>({
    queryKey: ["rentals"],
    queryFn: () => api.get<Rental[]>("/rentals/me").then(r => r.data),
    enabled,
    staleTime: 60_000,
    retry: false
  });

  return { data: data ?? [], loading: isLoading, refetch };
}
