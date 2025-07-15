export default function OwnerBanner({ owner }: { owner: string }) {
  return (
    <p className="text-xs text-gray-500">
      Publicado por <span className="font-medium">@{owner}</span>
    </p>
  );
}
