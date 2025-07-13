// src/hooks/useStripe.ts
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export function useStripe() {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    (async () => {
      const pk = import.meta.env.VITE_STRIPE_PK;
      if (pk && !stripe) {
        const s = await loadStripe(pk);
        setStripe(s);
      }
    })();
  }, [stripe]);

  return stripe;
}
