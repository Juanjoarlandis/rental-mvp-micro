export default function HashtagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map(t => (
        <li key={t} className="text-sm text-sky-700 dark:text-sky-400">#{t.replace(/^#/, '')}</li>
      ))}
    </ul>
  );
}
