/**
 * FAQ – Accessible Accordion (WAI–ARIA Disclosure Pattern)
 * • Animación fade‑in con Intersection Observer
 * • Soporta prefers‑reduced‑motion
 */
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef } from 'react';
import Container from '../shared/Container';

const FAQS: [string, string][] = [
  [
    '¿Cómo se gestionan los pagos?',
    'Usamos Stripe Connect para retener la fianza y liberar el pago una vez devuelto el ítem.',
  ],
  [
    '¿Qué pasa si mi herramienta se daña?',
    'Dispones de un seguro opcional a todo riesgo y un sistema de valoraciones para vetar a malos usuarios.',
  ],
  ['¿Puedo cancelar una reserva?', 'Sí, hasta 12 h antes sin penalización.'],
  ['¿Hay comisión?', 'Solo cobramos un 8 % al propietario cuando se confirma el alquiler.'],
];

export default function FAQ({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  /* Fade‑in when section enters viewport */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && el.classList.add('visible'),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`${className} fade-in`}>
      <Container>
        <h2 className="mb-8 text-center text-3xl font-bold">Preguntas frecuentes</h2>

        <div className="mx-auto max-w-3xl divide-y divide-gray-200 dark:divide-gray-700">
          {FAQS.map(([q, a]) => (
            <Disclosure key={q} as="div" className="py-4">
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className="flex w-full items-center justify-between text-left text-lg font-medium focus:outline-none focus-visible:ring focus-visible:ring-brand/40"
                    aria-label={open ? `Cerrar ${q}` : `Abrir ${q}`}
                  >
                    <span>{q}</span>
                    <ChevronDownIcon
                      className={`h-6 w-6 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </Disclosure.Button>
                  <Transition
                    show={open}
                    enter="transition duration-200 ease-out"
                    enterFrom="transform scale-y-95 opacity-0"
                    enterTo="transform scale-y-100 opacity-100"
                    leave="transition duration-150 ease-in"
                    leaveFrom="transform scale-y-100 opacity-100"
                    leaveTo="transform scale-y-95 opacity-0"
                  >
                    <Disclosure.Panel className="pt-3 text-gray-600 dark:text-gray-300">
                      {a}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </Container>
    </section>
  );
}
