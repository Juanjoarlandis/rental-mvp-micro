/* -------------------------------------------------------------- */
/*  src/pages/Home.tsx – landing 2025                             */
/* -------------------------------------------------------------- */
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
import logo from '../assets/agree.jpg';

/* Shared wrappers */
import Container from '../components/shared/Container';
import Section   from '../components/shared/Section';

/* Home blocks */
import TrustBar        from '../components/Home/TrustBar';
import CategoryGrid    from '../components/Home/CategoryGrid';
import Benefits        from '../components/Home/Benefits';
import Stats           from '../components/Home/Stats';
import FlowSteps       from '../components/Home/FlowSteps';
import Testimonials    from '../components/Home/Testimonials';
import IncentiveBanner from '../components/Home/IncentiveBanner';
import FAQ             from '../components/Home/FAQ';
import LogoCloud       from '../components/Home/LogoCloud';

/* ----------------------------- HERO COPY ----------------------------- */
const HERO = {
  h1     : 'Alquila y gana dinero extra hoy mismo',
  tagLine: 'Únete a la mayor comunidad local de alquiler de herramientas y gadgets.',
  bullets: '+3 000 artículos · 24 000 € ahorrados · 0 fraudes',
};

export default function Home() {
  /* Animación secuencial para FlowSteps */
  const stepsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) =>
        e.isIntersecting &&
        [...e.target.children].forEach((c, i) => {
          c.classList.add('visible');
          (c as HTMLElement).style.transitionDelay = `${i * 0.15}s`;
        }),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ----------------------------- HERO ----------------------------- */}
      <header
        className="
          relative isolate flex min-h-[90vh] flex-col items-center
          justify-center overflow-hidden text-center text-white dark:text-gray-100
        "
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/10 dark:from-gray-900/80" />
        <img
          src={logo}
          alt="Vecino entregando una taladradora a otra persona frente a un garaje"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          loading="eager"
        />

        <Container>
          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-extrabold sm:text-6xl">
            {HERO.h1}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg/relaxed text-white/90 dark:text-gray-300">
            {HERO.tagLine}
          </p>
          <p className="mt-3 text-sm uppercase tracking-wider text-brand-light">
            {HERO.bullets}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn inline-flex gap-2">
              Crear cuenta gratis
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link to="/dashboard#add" className="btn--ghost inline-flex gap-2">
              <PlusIcon className="h-5 w-5" />
              Publicar un ítem
            </Link>
          </div>
        </Container>

        {/* Badge bar */}
        <TrustBar />
      </header>

      {/* --------------------------- CATEGORÍAS -------------------------- */}
      <CategoryGrid />

      {/* ---------------------------- BENEFICIOS ------------------------- */}
      <Benefits />

      {/* ----------------------------- STATS ---------------------------- */}
      <Stats />

      {/* --------------------------- CÓMO FUNCIONA ----------------------- */}
      <FlowSteps ref={stepsRef} />

      {/* ---------------------------- TESTIMONIOS ------------------------ */}
      <Testimonials />

      {/* ----------------------- INCENTIVO FOMO ------------------------- */}
      <IncentiveBanner />

      {/* ------------------------------ FAQ ----------------------------- */}
      <FAQ />

      {/* ------------------------- CLOUD DE LOGOS ----------------------- */}
      <LogoCloud />

      {/* ---------- CTA FINAL (dentro de IncentiveBanner) --------------- */}
    </>
  );
}
