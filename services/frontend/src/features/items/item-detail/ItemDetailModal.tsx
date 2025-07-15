import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

import useItem from './hooks/useItem';
import ModalShell from '../add-product-modal/ModalShell';
import Skeleton from './components/Skeleton';
import ImageGallery from './components/ImageGallery';
import PriceBlock from './components/PriceBlock';
import CategoryChips from './components/CategoryChips';
import HashtagList from './components/HashtagList';
import InfoGrid from './components/InfoGrid';
import OwnerBanner from './components/OwnerBanner';

type Props = {
  open: boolean;
  itemId: number | null;
  onClose(): void;
};

export default function ItemDetailModal({ open, itemId, onClose }: Props) {
  const { data, isLoading } = useItem(itemId);

  return (
    <ModalShell open={open} title={data?.name ?? 'Cargando…'} onClose={onClose}>
      <div className="p-6 overflow-y-auto max-h-[90vh]">
        {isLoading || !data ? (
          <Skeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Galería */}
            <ImageGallery urls={data.image_urls} />

            {/* Columna derecha */}
            <div className="space-y-6">
              <PriceBlock
                price={data.price_per_h}
                compare={data.compare_at_price}
                stock={data.stock}
              />

              <CategoryChips cats={data.categories} />
              <HashtagList tags={data.hashtags} />

              <p className="prose max-w-none dark:prose-invert">{data.description}</p>

              <InfoGrid item={data} />

              <OwnerBanner owner={data.owner_username} />

              <button className="btn w-full md:w-auto">Contactar vendedor</button>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}
