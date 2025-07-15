/* -------------------------------------------------------------------------- */
/*  src/components/layout/Footer.tsx                                          */
/* -------------------------------------------------------------------------- */
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* ----------------------------- ZONA SUPERIOR ----------------------------- */}
      <div className="container mx-auto grid gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">
        {/* Marca + descripción */}
        <div className="space-y-4 lg:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo Rental‑MVP"
              className="h-10 w-auto"
              decoding="async"
            />
            <span className="sr-only">Rental‑MVP</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-gray-400">
            Plataforma de alquiler P2P para herramientas, gadgets y mucho
            más. Monetiza lo que tienes y ayuda al planeta reduciendo el
            consumo masivo.
          </p>
        </div>

        {/* Navegación */}
        <FooterCol title="Producto">
          <FooterLink to="/">Explorar</FooterLink>
          <FooterLink to="/dashboard#add">
            Publicar ítem
          </FooterLink>
          <FooterLink to="/pricing">Precios</FooterLink>
          <FooterLink to="/docs">Documentación API</FooterLink>
        </FooterCol>

        <FooterCol title="Empresa">
          <FooterLink to="/about">Sobre nosotros</FooterLink>
          <FooterLink to="/blog">Blog</FooterLink>
          <FooterLink to="/careers">Empleo</FooterLink>
          <FooterLink to="/contact">Contacto</FooterLink>
        </FooterCol>

        <FooterCol title="Legal">
          <FooterLink to="/legal/terms">Términos</FooterLink>
          <FooterLink to="/legal/privacy">Privacidad</FooterLink>
          <FooterLink to="/legal/cookies">Cookies</FooterLink>
          <FooterLink to="/legal/security">Seguridad</FooterLink>
        </FooterCol>
      </div>

      {/* ----------------------------- BOTTOM BAR ------------------------------ */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 py-8 text-sm sm:flex-row">
          {/* Copy */}
          <p className="text-gray-400">
            © {year} Rental‑MVP. Todos los derechos reservados.
          </p>

          {/* Social */}
          <div className="flex gap-4">
            <SocialLink
              href="https://github.com/juanjoarlandisg25"
              label="GitHub"
              icon={FaGithub}
            />
            <SocialLink
              href="https://linkedin.com"
              label="LinkedIn"
              icon={FaLinkedin}
            />
            <SocialLink
              href="https://twitter.com"
              label="Twitter"
              icon={FaTwitter}
            />
            <SocialLink
              href="https://instagram.com"
              label="Instagram"
              icon={FaInstagram}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------- Helpers & Sub‑components ------------------------ */
function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h3>
      <nav className="space-y-2 text-sm">{children}</nav>
    </div>
  );
}

function FooterLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {children}
    </Link>
  );
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      title={label}
      className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="h-5 w-5" />
      <span className="sr-only">{label}</span>
    </a>
  );
}
