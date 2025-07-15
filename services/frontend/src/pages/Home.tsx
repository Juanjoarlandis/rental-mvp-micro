/* src/pages/Home.tsx */
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  PlusIcon,
  CloudArrowUpIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ShieldCheckIcon,  // NEW: Para benefits
  UsersIcon,        // NEW
  GlobeAltIcon,     // NEW
} from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';  // NEW: Para animaciones
import clsx from 'clsx';

import Container from '../components/shared/Container';
import Section from '../components/shared/Section';

import Stats from '../components/Home/Stats';
import LogoCloud from '../components/Home/LogoCloud';
import Testimonials from '../components/Home/Testimonials';
import FAQ from '../components/Home/FAQ';

// NEW: Sección Benefits
const Benefits = () => {
  const BENEFITS = [
    { icon: ShieldCheckIcon, title: 'Seguro y confiable', desc: 'Pagos protegidos con Stripe y verificación de usuarios.' },
    { icon: UsersIcon, title: 'Comunidad local', desc: 'Conecta con vecinos y reduce huella ecológica.' },
    { icon: GlobeAltIcon, title: 'Fácil de usar', desc: 'Publica en minutos, reserva al instante.' },
  ];

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    Array.from(el.querySelectorAll('.fade-in')).forEach(child => io.observe(child));
    return () => io.disconnect();
  }, []);

  return (
    <Section title="Beneficios">
      <Container>
        <div ref={ref} className="grid gap-8 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="fade-in text-center space-y-2 p-6 rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-700">  {/* 🆕 Dark variants */}
              <Icon className="mx-auto h-12 w-12 text-brand" />
              <h3 className="text-xl font-semibold dark:text-gray-100">{title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

const STEPS = [  // Updated: Cards con shadows
  {
    title: 'Publica',
    desc: 'Sube tu producto, ponle precio y límites de uso.',
    icon: CloudArrowUpIcon,
  },
  {
    title: 'Reserva',
    desc: 'Los usuarios pagan la fianza y reservan al instante.',
    icon: CalendarDaysIcon,
  },
  {
    title: 'Gana',
    desc: 'Entregas el ítem, recibes el pago y valoraciones ⭐',
    icon: BanknotesIcon,
  },
];

export default function Home() {
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {  // Animación para steps
    const el = stepsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          Array.from(e.target.children).forEach((child, i) => {
            child.classList.add('visible');
            (child as HTMLElement).style.transitionDelay = `${i * 0.2}s`;
          });
        }
      });
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ---------- HERO (mejorado: gradient + overlay image, dark mode, más contraste) ---------- */}
      <section 
        className="relative isolate overflow-hidden py-32 text-white dark:text-gray-100"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent), url("https://source.unsplash.com/random/1920x1080/?tools,renting,community&w=1920") no-repeat center/cover',  // 🆕 Optimizado con ?w=1920
        }}
      >
        <span className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl animate-pulse dark:bg-gray-800/10" />  {/* 🆕 Dark variant */}

        <Container>
          <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-28 text-center fade-in visible">  {/* +fade-in */}
            <h1 className="max-w-3xl text-balance text-5xl font-extrabold leading-tight md:text-6xl">  {/* +md:text-6xl */}
              Dónde tus cosas <br className="hidden sm:inline" />
              <span className="text-white/80 dark:text-gray-300/80">cambian de mano</span>
            </h1>

            <p className="max-w-xl text-lg/relaxed text-white/90 dark:text-gray-300">
              Alquila herramientas, gadgets o equipamiento deportivo y monetiza lo
              que ya tienes. ¡Conecta con tu barrio y ahorra al planeta!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard" className="btn inline-flex gap-2">
                Explorar catálogo <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link to="/dashboard#add" className="btn--ghost inline-flex gap-2">
                <PlusIcon className="h-5 w-5" />
                Publicar mi primer ítem
              </Link>
            </div>
          </div>
        </Container>

        {/* wave separator (más suave, dark mode) */}
        <svg
          aria-hidden
          viewBox="0 0 1440 120"
          className="block w-full text-brand dark:text-gray-800"  // 🆕 Dark variant
          preserveAspectRatio="none"
        >
          <path
            d="M0,96L48,106.7C96,117,192,139,288,128C384,117,480,75,576,58.7C672,43,768,53,864,74.7C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            className="fill-white dark:fill-gray-900"  // 🆕 Dark fill
          />
        </svg>
      </section>

      {/* ---------- STATS (ya animado, con dark mode) ---------- */}
      <Stats />

      {/* ---------- LOGO CLOUD (con hover, dark mode) ---------- */}
      <LogoCloud />

      {/* ---------- BENEFITS (nueva sección) ---------- */}
      <Benefits />

      {/* ---------- CÓMO FUNCIONA (cards con animaciones secuenciales, alterna bg) ---------- */}
      <Section title="¿Cómo funciona?" className="bg-gray-100 dark:bg-gray-800">  {/* 🆕 Alterna bg para contraste */}
        <Container>
          <div ref={stepsRef} className="grid gap-12 md:grid-cols-3">
            {STEPS.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="fade-in text-center space-y-4 p-6 rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-700 dark:shadow-gray-800">  {/* 🆕 Dark */}
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

      {/* ---------- TESTIMONIALS (mejorado: grid responsivo, alterna bg) ---------- */}
      <Testimonials className="bg-white dark:bg-gray-900" />  {/* 🆕 Dark */}

      {/* ---------- FAQ (con iconos y transiciones, alterna bg con radial-gradient en CTA) ---------- */}
      <FAQ className="bg-gray-100 dark:bg-gray-800" />  {/* 🆕 Alterna bg (gray-100 para menos claror) */}

      {/* ---------- CTA FINAL (con animación, radial-gradient sutil) ---------- */}
      <section className="bg-brand py-16 text-center text-white fade-in relative" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.15), transparent)' }}>  {/* 🆕 Radial-gradient más visible (0.15) para profundidad */}
        <Container>
          <h2 className="mb-6 text-3xl font-bold">
            ¿Listo para estrenar ingresos extra?
          </h2>
          <Link to="/register" className="btn inline-flex gap-2">
            Crear cuenta gratis <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </Container>
      </section>
    </>
  );
}