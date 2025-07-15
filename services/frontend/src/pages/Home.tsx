/* Home.tsx – full‑page redesign 2025
   ✱ Accesibilidad AA, dark‑mode parity, lazy‑loading, perf‑safe animations.
   ✱ Dependencias: React 18, Tailwind CSS v3, @heroicons/react 24/solid/outline.
*/
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  PlusIcon,
  CloudArrowUpIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  UsersIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/solid';
import { useEffect, useRef } from 'react';
import Container from '../components/shared/Container';
import Section from '../components/shared/Section';
import Stats from '../components/Home/Stats';
import LogoCloud from '../components/Home/LogoCloud';
import Testimonials from '../components/Home/Testimonials';
import FAQ from '../components/Home/FAQ';

/* ---------- CONSTANTS ---------- */
const HERO_COPY = {
  title: 'Gana dinero con lo que ya tienes',
  tagline:
    'Alquila tus herramientas y gadgets en minutos y contribuye a un barrio más sostenible.',
};

const BENEFITS = [
  {
    icon: ShieldCheckIcon,
    title: 'Pagos 100 % seguros',
    desc: 'Stripe Connect y verificación de identidad en cada transacción.',
  },
  {
    icon: UsersIcon,
    title: 'Comunidad local',
    desc: 'Conecta con vecinos y reduce la huella de carbono.',
  },
  {
    icon: GlobeAltIcon,
    title: 'Sin fricción',
    desc: 'Publica, reserva y gana en tres clics.',
  },
];

const STEPS = [
  {
    icon: CloudArrowUpIcon,
    title: 'Publica',
    desc: 'Sube tu producto, pon precio y reglas de uso.',
  },
  {
    icon: CalendarDaysIcon,
    title: 'Reserva',
    desc: 'Los usuarios pagan la fianza y reservan al instante.',
  },
  {
    icon: BanknotesIcon,
    title: 'Gana',
    desc: 'Entregas el ítem y recibes el pago asegurado.',
  },
];

/* ---------- COMPONENTS ---------- */
function Benefits() {
  const ref = useRef<HTMLDivElement>(null);

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
        <div ref={ref} className="grid gap-8 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="fade-in space-y-3 rounded-lg bg-white p-6 text-center shadow transition hover:shadow-md dark:bg-gray-800 dark:shadow-gray-700"
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

export default function Home() {
  const stepsRef = useRef<HTMLDivElement>(null);

  /* Sequential fade‑in for “Cómo funciona” cards */
  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            [...e.target.children].forEach((child, i) => {
              child.classList.add('visible');
              (child as HTMLElement).style.transitionDelay = `${i * 0.15}s`;
            });
          }
        }),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <header
        className="relative isolate flex min-h-[90vh] items-center justify-center overflow-hidden px-6 text-center text-white dark:text-gray-100"
      >
        {/* Background image + gradient overlay */}
        <img
          src="https://source.unsplash.com/1920x1080/?sharing,tools&auto=format&w=1920"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/20 dark:from-gray-900/90" />

        <Container>
          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-extrabold leading-tight sm:text-6xl">
            {HERO_COPY.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg/relaxed text-white/90 dark:text-gray-300">
            {HERO_COPY.tagline}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn inline-flex gap-2">
              Empezar ahora <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link to="/dashboard#add" className="btn--ghost inline-flex gap-2">
              <PlusIcon className="h-5 w-5" /> Publicar un ítem
            </Link>
          </div>
        </Container>
      </header>

      {/* ---------- STATS ---------- */}
      <Stats />

      {/* ---------- LOGO CLOUD ---------- */}
      <LogoCloud />

      {/* ---------- BENEFITS ---------- */}
      <Benefits />

      {/* ---------- CÓMO FUNCIONA ---------- */}
      <Section title="¿Cómo funciona?" className="bg-gray-100 dark:bg-gray-800">
        <Container>
          <div ref={stepsRef} className="grid gap-12 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="fade-in space-y-4 rounded-lg bg-white p-6 text-center shadow transition hover:shadow-md dark:bg-gray-700 dark:shadow-gray-800"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 dark:bg-brand/20">
                  <Icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-xl font-semibold dark:text-gray-100">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- TESTIMONIOS ---------- */}
      <Testimonials className="bg-white dark:bg-gray-900" />

      {/* ---------- FAQ ---------- */}
      <FAQ className="bg-gray-100 dark:bg-gray-800" />

      {/* ---------- CTA FINAL ---------- */}
      <section
        className="relative bg-brand py-16 text-center text-white"
        style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.12), transparent)' }}
      >
        <Container>
          <h2 className="mb-6 text-3xl font-bold">
            ¿Listo para empezar a rentabilizar tus cosas?
          </h2>
          <Link to="/register" className="btn inline-flex gap-2">
            Crear cuenta gratis <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </Container>
      </section>
    </>
  );
}
