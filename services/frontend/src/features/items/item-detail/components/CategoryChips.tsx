import Chip from '../../add-product-modal/components/Chip';

type Cat = { id: number; name: string };

export default function CategoryChips({ cats }: { cats: Cat[] }) {
  if (!cats.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {cats.map(c => (
        <Chip key={c.id} onClick={() => null}>
          {c.name}
        </Chip>
      ))}
    </div>
  );
}
