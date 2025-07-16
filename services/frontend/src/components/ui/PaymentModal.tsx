/* -------------------------------------------------------------------------- */
/*  src/components/ui/PaymentModal.tsx                                        */
/* -------------------------------------------------------------------------- */
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

/* ⚠️  Usa tu clave pública de Stripe (env var VITE_STRIPE_PK) */
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK!);

type Props = {
  open: boolean;
  clientSecret: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function PaymentModal({
  open,
  clientSecret,
  onClose,
  onSuccess,
}: Props) {
  if (!clientSecret) return null;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[60]">
        {/* ---------- backdrop ---------- */}
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

        {/* ---------- panel ---------- */}
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
            <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
              <header className="flex items-center justify-between border-b px-5 py-4">
                <Dialog.Title className="text-base font-semibold">
                  Pago de fianza
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </header>

              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: { theme: 'stripe' } }}
              >
                <CheckoutForm onCancel={onClose} onSuccess={onSuccess} />
              </Elements>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

/* ------------------ formulario interno ------------------ */
function CheckoutForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const qc = useQueryClient(); // ← invalidate cache de alquileres

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    setProcessing(false);

    if (error) {
      toast.error(error.message ?? 'No se pudo procesar el pago.');
    } else {
      qc.invalidateQueries({ queryKey: ['rentals'] });
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <PaymentElement />

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn--secondary px-4 py-2 text-sm"  
        >
          Cancelar
        </button>

        <button
          disabled={!stripe || !elements || processing}
          className="btn px-6 py-2 text-sm"
        >
          {processing ? (
            <>
              <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
              Procesando…
            </>
          ) : (
            'Pagar y confirmar'
          )}
        </button>
      </div>
    </form>
  );
}
