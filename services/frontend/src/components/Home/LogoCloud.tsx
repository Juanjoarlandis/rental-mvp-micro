/**
 * LogoCloud – Continuous marquee animation (CSS‑only)
 * • Pausas en hover y respeta prefers‑reduced‑motion
 * • Optimiza logos con loading="lazy" y alt descriptivo
 */
import Container from '../shared/Container';

const LOGOS = [
  { src: 'https://dummyimage.com/160x60/cccccc/ffffff&text=Bosch', alt: 'Bosch' },
  { src: 'https://dummyimage.com/160x60/cccccc/ffffff&text=Makita', alt: 'Makita' },
  { src: 'https://dummyimage.com/160x60/cccccc/ffffff&text=Black+%26+Decker', alt: 'Black & Decker' },
  { src: 'https://dummyimage.com/160x60/cccccc/ffffff&text=Dewalt', alt: 'Dewalt' },
  { src: 'https://dummyimage.com/160x60/cccccc/ffffff&text=GoPro', alt: 'GoPro' },
  { src: 'https://dummyimage.com/160x60/cccccc/ffffff&text=Xiaomi', alt: 'Xiaomi' },
];

export default function LogoCloud() {
  /* Duplicate array for seamless loop */
  const logos = [...LOGOS, ...LOGOS];

  return (
    <section className="bg-gray-50 py-12 dark:bg-gray-900">
      <Container>
        <div className="overflow-hidden">
          <ul className="flex animate-marquee space-x-12 hover:[animation-play-state:paused]">
            {logos.map((l, i) => (
              <li key={`${l.alt}-${i}`} className="shrink-0">
                <img
                  src={l.src}
                  alt={l.alt}
                  className="h-12 w-auto object-contain grayscale hover:grayscale-0"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
