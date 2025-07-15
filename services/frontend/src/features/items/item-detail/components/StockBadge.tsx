type Props = { stock: number };

export default function StockBadge({ stock }: Props) {
  const color = stock === 0 ? 'bg-red-600' : stock < 5 ? 'bg-amber-500' : 'bg-emerald-600';
  const label = stock === 0 ? 'Sin stock' : stock < 5 ? 'Quedan pocas unidades' : 'En stock';

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold text-white ${color}`}>
      {label}
    </span>
  );
}
