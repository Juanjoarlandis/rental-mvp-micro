/**
 * Stats – Animated count‑up respecting prefers‑reduced‑motion
 * • Starts counting when component enters viewport
 */
import { useEffect, useRef, useState } from 'react';
import Container from '../shared/Container';

const DATA = [
  { label: 'Ítems publicados', value: 3124 },
  { label: 'Usuarios registrados', value: 857 },
  { label: '€ ahorrados', value: 24367 },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Count‑up util */
  const Counter = ({ end }: { end: number }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!visible) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setCount(end);
        return;
      }
      let start = 0;
      const duration = 1800; // ms
      const startTime = performance.now();
      const step = (ts: number) => {
        const progress = Math.min((ts - startTime) / duration, 1);
        const val = Math.floor(progress * (end - start) + start);
        setCount(val);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, [visible, end]);
    return <>{count.toLocaleString('es-ES')}</>;
  };

  return (
    <section ref={ref} className="bg-white py-12 dark:bg-gray-800">
      <Container>
        <div className="grid gap-8 sm:grid-cols-3">
          {DATA.map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-extrabold text-brand">
                <Counter end={value} />
              </p>
              <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                {label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
