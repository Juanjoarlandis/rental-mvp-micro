/* src/components/Home/Testimonials.tsx */
import Container from '../shared/Container';

const TESTIMONIALS = [
  {
    name: 'Laura P.',
    text: 'Alquilé mi cámara reflex y pagué las vacaciones. ¡Súper fácil!',
    avatar: 'https://source.unsplash.com/48x48/?woman,face'
  },
  {
    name: 'Carlos G.',
    text: 'Encontré un taladro a 5 € y no tuve que comprar uno nuevo.',
    avatar: 'https://source.unsplash.com/48x48/?man,face'
  },
  {
    name: 'Marta S.',
    text: 'Me encanta la seguridad del pago con fianza. Repetiré.',
    avatar: 'https://source.unsplash.com/48x48/?lady,face'
  }
];

export default function Testimonials() {
  return (
    <section className="bg-white py-16">
      <Container>
        <h2 className="mb-10 text-center text-3xl font-bold">Historias reales</h2>

        <div className="grid gap-6 md:grid-cols-3">  {/* NEW: Grid en lugar de scroll */}
          {TESTIMONIALS.map(t => (
            <article
              key={t.name}
              className="rounded-xl bg-white p-6 shadow-card transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
                <p className="font-semibold">{t.name}</p>
              </div>
              <p className="mt-4 text-sm text-gray-600">“{t.text}”</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}