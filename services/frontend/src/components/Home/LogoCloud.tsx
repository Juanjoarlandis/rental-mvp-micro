import Container from '../shared/Container';

const LOGOS = [
  'https://dummyimage.com/160x60/cccccc/ffffff?text=Bosch',
  'https://dummyimage.com/160x60/cccccc/ffffff?text=Makita',
  'https://dummyimage.com/160x60/cccccc/ffffff?text=Black+%26+Decker',
  'https://dummyimage.com/160x60/cccccc/ffffff?text=Dewalt',
  'https://dummyimage.com/160x60/cccccc/ffffff?text=GoPro',
  'https://dummyimage.com/160x60/cccccc/ffffff?text=Xiaomi'
];

export default function LogoCloud() {
  return (
    <section className="bg-gray-50 py-12 dark:bg-surface-dark">
      <Container>
        <div className="grid grid-cols-2 items-center gap-8 opacity-70 sm:grid-cols-3 lg:grid-cols-6">
          {LOGOS.map(src => (
            <img
              key={src}
              src={src}
              alt=""
              className="
                mx-auto h-12 w-auto object-contain transition-all duration-300
                grayscale hover:grayscale-0 hover:scale-105
                dark:invert dark:opacity-90           /* NUEVO: legible en modo noche */
              "
              loading="lazy"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
