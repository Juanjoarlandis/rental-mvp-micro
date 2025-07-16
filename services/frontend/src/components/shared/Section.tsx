// src/components/shared/Section.tsx
import clsx from 'clsx';

type Props = {
  /** Título visible encima del contenido (opcional). */
  title?: string;
  /** Contenido arbitrario (cards, grids, etc.). */
  children: React.ReactNode;
  /**
   *  Identificador HTML para enlaces ancla
   *  (p. ej. <a href="#pricing">).
   */
  id?: string;
  /**
   *  Clases extra que se inyectan en el elemento
   *   raíz — permiten colorear el fondo, etc.
   */
  className?: string;
};

/**
 *  Wrapper coherente para todas las secciones verticales de la web.
 *  Añade relleno y, opcionalmente, un encabezado H2 centrado.
 */
export default function Section({
  title,
  children,
  id,
  className = '',
}: Props) {
  return (
    <section
      id={id}
      className={clsx('space-y-6 py-16', className)}
    >
      {title && (
        <h2 className="text-center text-3xl font-bold tracking-tight">
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}
