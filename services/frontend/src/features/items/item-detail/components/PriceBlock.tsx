import StockBadge from './StockBadge';

type Props = {
  price: number;
  compare?: number | null;
  stock: number;
};

export default function PriceBlock({ price, compare, stock }: Props) {
  const hasDiscount = compare && compare > price;
  const discount = hasDiscount ? Math.round(((compare - price) / compare) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-brand">
          €{price.toFixed(2)}
        </span>
        <span className="text-xs text-gray-500">/ h</span>
        {hasDiscount && (
          <>
            <span className="text-lg line-through text-gray-400">
              €{compare!.toFixed(2)}
            </span>
            <span className="badge badge--danger">–{discount}%</span>
          </>
        )}
      </div>
      <StockBadge stock={stock} />
    </div>
  );
}

