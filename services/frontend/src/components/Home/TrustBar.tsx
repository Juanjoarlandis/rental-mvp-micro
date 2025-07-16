/* -------------------------------------------------------------------------- */
/*  src/components/Home/TrustBar.tsx                                          */
/* -------------------------------------------------------------------------- */
export default function TrustBar() {
  const BADGES = [
    ['https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white', 'Stripe'],
    ['https://img.shields.io/badge/SSL%20256--bit-22C55E?style=for-the-badge&logoColor=white', 'SSL 256‑bit'],
    ['https://img.shields.io/badge/Seguro%20AXA-0055A4?style=for-the-badge&logo=axa&logoColor=white', 'Seguro AXA'],
    ['https://img.shields.io/badge/Protecci%C3%B3n-100%25-FFAA00?style=for-the-badge&logoColor=white', 'Protección 100 %'],
  ] as const;

  return (
    <ul
      className="
        mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4
        text-center text-[0.7rem] font-medium text-white/90
        opacity-90 [@media(prefers-reduced-motion:reduce)]:animate-none
      "
    >
      {BADGES.map(([src, label]) => (
        <li key={label} className="flex flex-col items-center gap-1">
          {/* Logo */}
          <img
            src={src}
            alt={label}
            className="h-6 w-auto object-contain"
            loading="lazy"
            width={88}
            height={24}
          />
          {/* Texto */}
          <span className="leading-tight">{label}</span>
        </li>
      ))}
    </ul>
  );
}
