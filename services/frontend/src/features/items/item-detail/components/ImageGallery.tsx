import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

export default function ImageGallery({ urls }: { urls: string[] }) {
  const [idx, setIdx] = useState(0);
  const total = urls.length;

  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    trackMouse: true,
  });

  function next() {
    setIdx((i) => (i + 1) % total);
  }
  function prev() {
    setIdx((i) => (i - 1 + total) % total);
  }

  return (
    <div {...handlers} className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-700">
      {/* main */}
        <div className="relative aspect-[4/3] w-full">          {/* NUEVO: ratio 4:3 */}
        <img
            src={urls[idx]}
            alt={`Imagen ${idx + 1}`}
            className="absolute inset-0 h-full w-full
                    object-contain rounded-xl"             
        />

        {total > 1 && (
          <>
            <NavBtn pos="left" onClick={prev} />
            <NavBtn pos="right" onClick={next} />
          </>
        )}
      </div>

      {/* thumbs */}
      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto px-2 pb-2">
          {urls.map((u, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Miniatura ${i + 1}`}
              className={clsx(
                'relative aspect-square h-16 overflow-hidden rounded-lg',
                i === idx && 'ring-2 ring-brand'
              )}
            >
              <img src={u} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavBtn({
  pos,
  onClick,
}: {
  pos: 'left' | 'right';
  onClick(): void;
}) {
  const Icon = pos === 'left' ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      onClick={onClick}
      className={clsx(
        'group absolute top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white',
        pos === 'left' ? 'left-2' : 'right-2'
      )}
    >
      <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
    </button>
  );
}
