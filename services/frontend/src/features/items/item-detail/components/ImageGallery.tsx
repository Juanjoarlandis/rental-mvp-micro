import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

type Props = { urls: string[] };

export default function ImageGallery({ urls }: Props) {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((idx + 1) % urls.length);
  const prev = () => setIdx((idx - 1 + urls.length) % urls.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative">
        <img
          src={urls[idx]}
          alt={`Imagen ${idx + 1}`}
          className="
            img-frame w-full h-80 md:h-[32rem] object-contain
          "
        />
        {urls.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {urls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {urls.map((u, i) => (
            <img
              key={i}
              src={u}
              onClick={() => setIdx(i)}
              className={`
                img-frame h-16 w-16 object-contain cursor-pointer transition
                ${i === idx ? 'ring-2 ring-brand scale-105' : 'opacity-70 hover:opacity-100'}
              `}
              alt={`Miniatura ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
