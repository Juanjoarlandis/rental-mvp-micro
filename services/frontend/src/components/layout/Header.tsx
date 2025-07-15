/* -------------------------------------------------------------------------- */
/*  src/components/layout/Header.tsx                                          */
/* -------------------------------------------------------------------------- */
import { Fragment, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx';

/* ------------------------------ Tema oscuro ------------------------------ */
function ThemeToggle() {
  const [dark, setDark] = useState(
    () =>
      localStorage.getItem('theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const cls = document.documentElement.classList;
    dark ? cls.add('dark') : cls.remove('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      title="Cambiar tema"
      onClick={() => setDark(!dark)}
      className="rounded-md p-2 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:hover:bg-gray-700"
    >
      {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      <span className="sr-only">Cambiar tema</span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Header                                  */
/* -------------------------------------------------------------------------- */
export default function Header() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  /* efecto blur‑>sólido */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* enlaces del panel móvil */
  const mobileLinks = token
    ? [
        { to: '/dashboard', label: 'Perfil' },
        { label: 'Salir', action: logout },
      ]
    : [
        { to: '/login', label: 'Entrar' },
        { to: '/register', label: 'Crear cuenta' },
      ];

  /* acción primaria escritorio: botón Login o Avatar */
  const PrimaryAction = () =>
    token ? (
      <Menu as="div" className="relative">
        <Menu.Button
          className="rounded-full p-1 text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:hover:bg-gray-700"
          aria-label="Abrir menú de usuario"
        >
          <UserCircleIcon className="h-8 w-8" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items className="absolute right-0 mt-2 w-44 rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 dark:bg-gray-800">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => navigate('/dashboard')}
                  className={clsx(
                    'flex w-full items-center gap-2 px-4 py-2 text-sm',
                    active && 'bg-gray-100 dark:bg-gray-700',
                  )}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  Perfil
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={clsx(
                    'flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600',
                    active && 'bg-gray-100 dark:bg-gray-700',
                  )}
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  Salir
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    ) : (
      <Link
        to="/login"
        className="inline-flex items-center gap-1 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-hover dark:bg-brand-dark dark:hover:bg-brand-hover-dark"
      >
        <ArrowRightOnRectangleIcon className="h-4 w-4" />
        Entrar
      </Link>
    );

  return (
    <Disclosure
      as="header"
      className={clsx(
        'sticky top-0 z-40 w-full backdrop-blur transition-colors supports-backdrop-blur:bg-white/40',
        scrolled
          ? 'bg-white/90 shadow-sm dark:bg-gray-900/90'
          : 'bg-white/60 dark:bg-gray-900/60',
      )}
    >
      {({ open }) => (
        <>
          {/* --------------------- barra principal --------------------- */}
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 md:py-4">
            {/* logo */}
            <Link to="/" aria-label="Inicio" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Rental‑MVP"
                className="h-8 w-auto select-none md:h-10"
                decoding="async"
              />
            </Link>

            {/* búsqueda (oculta en móvil) */}
            <input
              type="search"
              placeholder="Buscar ítem…"
              className="hidden w-full max-w-sm rounded-md border-gray-300 bg-white px-4 py-2 text-sm focus:border-brand focus:ring-brand dark:border-gray-700 dark:bg-gray-800 md:block"
            />

            {/* acciones */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* escritorio primary action */}
              <div className="hidden md:block">
                <PrimaryAction />
              </div>

              {/* hamburguesa mobile */}
              <Disclosure.Button
                aria-label="Abrir menú"
                className="rounded-md p-2 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:hover:bg-gray-700 md:hidden"
              >
                {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </Disclosure.Button>
            </div>
          </div>

          {/* --------------------- panel móvil ----------------------- */}
          <Transition
            show={open}
            enter="transition duration-150 ease-out"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-100 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <Disclosure.Panel className="border-t border-gray-200 bg-white/95 px-4 pb-6 dark:border-gray-700 dark:bg-gray-900/95 md:hidden">
              <nav className="flex flex-col gap-4 pt-6 text-base font-medium">
                {mobileLinks.map(({ to, label, action }) =>
                  action ? (
                    <button
                      key={label}
                      onClick={action}
                      className="flex items-center gap-2 text-left transition-colors hover:text-brand"
                    >
                      {label === 'Salir' ? (
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                      ) : (
                        <UserCircleIcon className="h-5 w-5" />
                      )}
                      {label}
                    </button>
                  ) : (
                    <NavLink
                      key={label}
                      to={to!}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-2 transition-colors hover:text-brand',
                          isActive && 'text-brand',
                        )
                      }
                    >
                      {label === 'Entrar' ? (
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      ) : (
                        <UserCircleIcon className="h-5 w-5" />
                      )}
                      {label}
                    </NavLink>
                  ),
                )}
              </nav>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
