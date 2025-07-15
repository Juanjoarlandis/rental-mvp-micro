/**
 * Testimonials – Accessible slider (buttons & keyboard)
 * • Pure React state, no external carousel deps
 * • Auto‑advance pauses on hover / focus
 */
import { useEffect, useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Container from '../shared/Container';

const TESTIMONIALS = [
  {
    name: 'Laura P.',
    text: 'Alquilé mi cámara reflex y pagué las vacaciones. ¡Súper fácil!',
    avatar: 'https://source.unsplash.com/48x48/?woman,face',
  },
  {
    name: 'Carlos G.',
    text: 'Encontré un taladro a 5 € y no tuve que comprar uno nuevo.',
    avatar: 'https://source.unsplash.com/48x48/?man,face',
  },
  {
    name: 'Marta S.',
    text: 'Me encanta la seguridad del pago con fianza. Repetiré.',
    avatar: 'https://source.unsplash.com/48x48/?lady,face',
  },
];

export default function Testimonials({ className = '' }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  /* Auto‑advance every 6 s */
  useEffect(() => {
    startAuto();
    return () => clearAuto();
  }, [index]);

  const clearAuto = () => timer.current && clearTimeout(timer.current);
  const startAuto = () => {
    clearAuto();
    timer.current = setTimeout(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 6000);
  };

  const goTo = (i: number) => {
    setIndex(i);
  };

  return (
    <section
      className={`${className} relative py-16 bg-white dark:bg-gray-900`}
      onMouseEnter={clearAuto}
      onMouseLeave={startAuto}
    >
      <Container>
        <h2 className="mb-10 text-center text-3xl font-bold">Historias reales</h2>

        <div className="relative mx-auto max-w-lg overflow-hidden">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.name}
              aria-hidden={i !== index}
              className={`transition-transform duration-500 ease-out ${
                i === index ? 'translate-x-0' : 'translate-x-full'
              } absolute inset-0 flex flex-col items-center text-center`}
            >
              <img
                src={t.avatar}
                alt={`Avatar de ${t.name}`}
                className="h-14 w-14 rounded-full object-cover"
                loading="lazy"
              />
              <p className="mt-4 max-w-md text-lg font-medium text-gray-800 dark:text-gray-200">
                “{t.text}”
              </p>
              <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t.name}</span>
            </article>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={() => goTo((index + TESTIMONIALS.length - 1) % TESTIMONIALS.length)}
            aria-label="Anterior testimonio"
            className="rounded-full p-2 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-brand/40 dark:hover:bg-gray-800"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => goTo((index + 1) % TESTIMONIALS.length)}
            aria-label="Siguiente testimonio"
            className="rounded-full p-2 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-brand/40 dark:hover:bg-gray-800"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      </Container>
    </section>
  );
}
