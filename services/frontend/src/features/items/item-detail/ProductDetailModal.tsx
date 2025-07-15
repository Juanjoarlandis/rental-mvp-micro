import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  ArrowPathIcon,
  HeartIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

import ImageGallery from './components/ImageGallery';
import PriceBlock from './components/PriceBlock';
import InfoGrid from './components/InfoGrid';
import CategoryChips from './components/CategoryChips';
import HashtagList from './components/HashtagList';
import OwnerBanner from './components/OwnerBanner';
import useItem from './hooks/useItem';
import { useAuth } from '../../../hooks/useAuth';

type Props = {
  itemId: number | null;
  open: boolean;
  onClose(): void;
};

export default function ProductDetailModal({ itemId, open, onClose }: Props) {
  const { data, isLoading } = useItem(itemId);
  const { token } = useAuth();

  /* ---------- placeholder mientras carga ---------- */
  if (isLoading || !data) {
    return (
      <SkeletonShell open={open} onClose={onClose} />
    );
  }

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        onClose={onClose}
        className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-10"
      >
        {/* BACKDROP */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* PANEL */}
        <div className="relative mx-auto flex w-full max-w-5xl">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="translate-y-8 sm:translate-y-0 sm:scale-95 opacity-0"
            enterTo="translate-y-0 sm:scale-100 opacity-100"
            leave="ease-in duration-150"
            leaveFrom="translate-y-0 sm:scale-100 opacity-100"
            leaveTo="translate-y-8 sm:translate-y-0 sm:scale-95 opacity-0"
          >
            <Dialog.Panel className="relative grid w-full overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-800 md:grid-cols-2">
              {/* ---------- GALERÍA ---------- */}
              <ImageGallery urls={data.image_urls} />

              {/* ---------- INFO ---------- */}
              <div className="flex flex-col gap-6 p-6 md:p-10">
                {/* header móvil */}
                <div className="flex items-start justify-between md:hidden">
                  <h2 className="text-xl font-semibold">{data.name}</h2>
                  <CloseBtn onClose={onClose} />
                </div>

                {/* breadcrumb opcional */}
                <CategoryChips cats={data.categories} />

                {/* nombre + acciones */}
                <div className="flex items-start justify-between">
                  <h1 className="hidden text-2xl font-bold md:block">
                    {data.name}
                  </h1>

                  {/* acciones like / share (solo usuarios) */}
                  {token && (
                    <div className="flex gap-2">
                      <IconBtn title="Favorito">
                        <HeartIcon className="h-5 w-5" />
                      </IconBtn>
                      <IconBtn title="Compartir">
                        <ShareIcon className="h-5 w-5" />
                      </IconBtn>
                    </div>
                  )}
                </div>

                {/* price + stock */}
                <PriceBlock
                  price={data.price_per_h}
                  compare={data.compare_at_price}
                  stock={data.stock}
                />

                {/* descripción */}
                {!!data.description && (
                  <p className="prose max-w-none text-gray-700 dark:prose-invert">
                    {data.description}
                  </p>
                )}

                {/* hashtags */}
                <HashtagList tags={data.hashtags} />

                {/* tabla atributos */}
                <InfoGrid item={data} />

                {/* banner propietario */}
                <OwnerBanner owner={data.owner_username} />

                {/* CTA reservar / contactar */}
                <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                  <button className="btn flex-1">Reservar ahora</button>
                  <button className="btn--ghost flex-1">Contactar</button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

/* ---------- Helpers ---------- */

function SkeletonShell({ open, onClose }: { open: boolean; onClose(): void }) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 grid place-items-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="h-[70vh] w-full max-w-5xl animate-pulse rounded-3xl bg-white/70 dark:bg-gray-700/70" />
      </Dialog>
    </Transition>
  );
}

function CloseBtn({ onClose }: { onClose(): void }) {
  return (
    <button
      onClick={onClose}
      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
      aria-label="Cerrar"
    >
      <XMarkIcon className="h-6 w-6" />
    </button>
  );
}

function IconBtn({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      className="rounded-full border p-2 text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
    >
      {children}
    </button>
  );
}
