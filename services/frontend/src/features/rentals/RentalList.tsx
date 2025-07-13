// src/features/rentals/RentalList.tsx
import { useAuth } from "../../hooks/useAuth";
import { useRentals, RentalStatus } from "./useRentals";
import clsx from "clsx";

/* ------------------------------------------------------------------ */
/*                         Helper visual                              */
/* ------------------------------------------------------------------ */
function statusLabel(s: RentalStatus) {
  switch (s) {
    case "pending":
      return ["Pendiente", "badge badge--danger"];
    case "confirmed":
      return ["Confirmado", "badge badge--ok"];
    case "returned":
      return ["Devuelto", "badge"];
  }
}

/* ------------------------------------------------------------------ */
/*                           Componente                               */
/* ------------------------------------------------------------------ */
export default function RentalList() {
  const { token } = useAuth();
  const {
    data: rentals,
    loading,
  } = useRentals(token); // ← hook actualizado

  if (!token)
    return (
      <p className="text-gray-500">
        Debes iniciar sesión para ver tus alquileres.
      </p>
    );

  if (loading) return <p className="text-gray-500">Cargando…</p>;

  if (!rentals.length)
    return <p className="text-gray-500">No tienes alquileres activos.</p>;

  return (
    <div className="space-y-2">
      {rentals.map(r => {
        const [txt, cls] = statusLabel(r.status);
        return (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-md bg-white p-3 shadow"
          >
            <span className="font-medium">{r.item.name}</span>
            <span className={cls}>{txt}</span>
          </div>
        );
      })}
    </div>
  );
}
