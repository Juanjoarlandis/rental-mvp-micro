/* -------------------------------------------------------------------------- */
/*  src/components/Home/Benefits.tsx                                          */
/* -------------------------------------------------------------------------- */
/*  • Sección “Por qué elegirnos” con 4 tarjetas animadas                     */
/*  • Accesibilidad AA, dark‑mode parity, animación fade‑in intersección      */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef } from 'react';
import {
  ShieldCheckIcon,
  UsersIcon,
  GlobeAltIcon,
  LifebuoyIcon,
} from '@heroicons/react/24/solid';

import Container from '../shared/Container';
import Section   from '../shared/Section';

/* ---------- Copys & datos (fácilmente traducibles/actualizables) ---------- */
const BENEFITS = [
  {
    icon: ShieldCheckIcon,
    title: 'Pagos 100 % seguros',
    desc : 'Stripe Connect y escrow de fianzas protegen cada transacción.',
  },
  {
    icon: UsersIcon,
    title: 'Comunidad verificada',
    desc : 'Valoración media 4,8/5 y perfiles autenticados.',
  },
  {
    icon: GlobeAltIcon,
    title: 'Ahorro sostenible',
    desc : 'Reduce hasta un 70 % frente a la compra y cuida el planeta.',
  },
  {
    icon: LifebuoyIcon,
    title: 'Seguro a todo riesgo',
    desc : 'Cobertura automática de hasta 1 000 € por artículo.',
  },
];

/* -------------------------------------------------------------------------- */
/*                             Componente principal                           */
/* -------------------------------------------------------------------------- */
export default function Benefits() {
  const ref = useRef<HTMLDivElement>(null);

  /* Fade‑in cuando la sección entra en viewport --------------------------- */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.2 }
    );
    el.querySelectorAll('.fade-in').forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <Section title="Por qué elegirnos">
      <Container>
        <div ref={ref} className="grid gap-8 md:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="
                fade-in space-y-3 rounded-lg bg-white p-6 text-center
                shadow transition hover:shadow-md dark:bg-gray-800 dark:shadow-gray-700
              "
            >
              <Icon className="mx-auto h-12 w-12 text-brand" />
              <h3 className="text-xl font-semibold dark:text-gray-100">{title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{desc}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
