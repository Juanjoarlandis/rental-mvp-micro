/* -------------------------------------------------------------- */
/*  TrustBar – badges de seguridad encima del fold                */
/* -------------------------------------------------------------- */
export default function TrustBar() {
  const BADGES = [
    ['https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white', 'Stripe'],
    ['https://img.shields.io/badge/SSL%20256--bit-brightgreen?style=for-the-badge&logoColor=white', 'SSL 256‑bit'],
    ['https://img.shields.io/badge/Seguro%20AXA-0055A4?style=for-the-badge&logo=axa&logoColor=white', 'Seguro AXA'],
    ['https://img.shields.io/badge/Protecci%C3%B3n-100%25-FFAA00?style=for-the-badge&logoColor=white', 'Protección 100 %'],
  ] as const;

  return (
    <ul
      className="
        mt-12 flex flex-wrap justify-center gap-6
        opacity-80 [@media(prefers-reduced-motion:reduce)]:hidden
      "
    >
      {BADGES.map(([src, alt]) => (
        <li key={alt} className="flex items-center gap-2 text-xs">
          <img src={src} alt={alt} className="h-8 w-8" loading="lazy" />
          {alt}
        </li>
      ))}
    </ul>
  );
}
