/* -------------------------------------------------------------- */
/*  FlowSteps – 4 pasos & garantía                                 */
/* -------------------------------------------------------------- */
import { forwardRef } from 'react';
import {
  CloudArrowUpIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid';
import Container from '../shared/Container';
import Section from '../shared/Section';

const STEPS = [
  ['Publica',         'Sube tu artículo en 3 min y define reglas.',   CloudArrowUpIcon],
  ['Reserva',         'Recibe la solicitud y la fianza al instante.', CalendarDaysIcon],
  ['Gana',            'Entrega el ítem y cobra automáticamente.',     BanknotesIcon],
  ['Devuelve seguro', 'Verifica estado y libera la fianza.',          ShieldCheckIcon],
];

export default forwardRef<HTMLDivElement>(function FlowSteps(_, ref) {
  return (
    <Section title="¿Cómo funciona?" className="bg-gray-100 dark:bg-gray-800">
      <Container>
        <div
          ref={ref}
          className="grid gap-12 md:grid-cols-4"
        >
          {STEPS.map(([t, d, I]) => {
            const Icon = I as typeof CloudArrowUpIcon;
            return (
              <article
                key={t as string}
                className="
                  fade-in space-y-4 rounded-lg bg-white p-6 text-center
                  shadow transition hover:shadow-md dark:bg-gray-700 dark:shadow-gray-800
                "
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 dark:bg-brand/20">
                  <Icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-lg font-semibold">{t}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{d}</p>
                {t === 'Devuelve seguro' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sin costes ocultos · Comisión 8 % solo al cobrar
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
});
