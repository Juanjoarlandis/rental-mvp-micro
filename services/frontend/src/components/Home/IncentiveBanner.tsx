/* -------------------------------------------------------------- */
/*  IncentiveBanner – FOMO                                        */
/* -------------------------------------------------------------- */
import { Link } from 'react-router-dom';
import Container from '../shared/Container';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function IncentiveBanner() {
  return (
    <section
      className="
        relative bg-brand py-14 text-center text-white
        before:absolute before:inset-0 before:-z-10
        before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent)]
      "
    >
      <Container>
        <h2 className="mb-3 text-3xl font-bold">5 € de regalo en tu primera reserva</h2>
        <p className="mb-6 text-sm">Solo para los primeros 100 registros de julio</p>
        <Link to="/register" className="btn inline-flex gap-2">
          Aprovechar cupón
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </Container>
    </section>
  );
}
