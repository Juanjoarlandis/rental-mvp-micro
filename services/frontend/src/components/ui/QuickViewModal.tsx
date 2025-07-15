/* -------------------------------------------------------------------------- */
/*  src/components/ui/QuickViewModal.tsx                                      */
/*  – ahora permite reservar el ítem vía micro-servicio **rentals**           */
/* -------------------------------------------------------------------------- */
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  StarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import clsx from "clsx";

import { Item } from "../../features/items/useItems";
import { createRental } from "../../features/rentals/createRental";
import { useAuth } from "../../hooks/useAuth";
import LazyImage from "./LazyImage";
import { resolveImage } from "../../utils";

type Props = {
  open: boolean;
  onClose: () => void;
  item: Item | null;
};

export default function QuickViewModal({ open, onClose, item }: Props) {
  /* ─────────── guard clause ─────────── */
  if (!item) return null;

  /* portada (1ª imagen o fallback) */
  const cover = item.image_urls?.[0] ?? item.image_url;
  const imgSrc = resolveImage(
    cover,
    `https://source.unsplash.com/800x600/?${encodeURIComponent(item.name)}`
  );

  /* ─────────── auth + reserva ─────────── */
  const { token } = useAuth();

  /* reserva de **1 h** a partir de “ya” (demo) */
  const reserve = useMutation({
    mutationFn: () => {
      const now = new Date();
      const plus1h = new Date(now.getTime() + 60 * 60 * 1000);
      return createRental(item.id, now.toISOString(), plus1h.toISOString());
    },
    onSuccess: data => {
      toast.success(
        `Reserva confirmada ✔️  •  Fianza: ${data.deposit.toFixed(2)} €`
      );
      onClose();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ??
        "No se pudo crear la reserva. Inténtalo más tarde.";
      toast.error(msg);
    },
  });

  const handleReserve = () => {
    if (!token) return toast.error("Debes iniciar sesión");
    if (!item.available)
      return toast.error("Este ítem no está disponible ahora mismo");
    reserve.mutate();
  };

  /* ────────────────── UI ────────────────── */
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* ---------- Backdrop ---------- */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* ---------- Panel ---------- */}
        <div className="fixed inset-0 grid place-items-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-150"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
              {/* ───────── header ───────── */}
              <header className="flex items-center justify-between border-b p-4">
                <Dialog.Title className="text-lg font-semibold">
                  {item.name}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </header>

              {/* ───────── body ───────── */}
              <section className="grid gap-6 overflow-y-auto p-6 md:grid-cols-2">
                {/* imagen */}
                <div className="flex items-center justify-center">
                  <LazyImage
                    src={imgSrc}
                    alt={item.name}
                    className="w-full max-h-[60vh] rounded-lg object-contain"
                  />
                </div>

                {/* info */}
                <div className="flex flex-col gap-4">
                  <p className="text-2xl font-bold text-brand">
                    {item.price_per_h.toFixed(2)} €/h
                  </p>

                  {/* rating provisional */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={clsx(
                          "h-5 w-5",
                          i < 4
                            ? "fill-amber-400 stroke-amber-400"
                            : "stroke-gray-300"
                        )}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-500">(4,0)</span>
                  </div>

                  {item.description ? (
                    <p className="prose max-w-none text-sm leading-relaxed">
                      {item.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Sin descripción.</p>
                  )}

                  {!!item.categories?.length && (
                    <div className="flex flex-wrap gap-2">
                      {item.categories.map(c => (
                        <span
                          key={c.id}
                          className="rounded-full bg-gray-100 px-3 py-0.5 text-xs text-gray-600"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* ───────── CTA ───────── */}
                  <button
                    onClick={handleReserve}
                    disabled={reserve.isLoading}
                    className="btn mt-auto w-full"
                  >
                    {reserve.isLoading ? (
                      <>
                        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
                        Reservando…
                      </>
                    ) : (
                      "Reservar ahora"
                    )}
                  </button>
                </div>
              </section>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
