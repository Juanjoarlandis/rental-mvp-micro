import clsx from 'clsx';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  selected?: boolean;
  onClick: () => void;
}>;

export default function Chip({ selected, onClick, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-full px-4 py-1 text-sm font-medium transition-all',
        selected
          ? 'bg-brand text-white shadow-md hover:shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
      )}
    >
      {children}
    </button>
  );
}
