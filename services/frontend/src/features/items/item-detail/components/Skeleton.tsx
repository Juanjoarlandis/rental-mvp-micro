export default function Skeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="space-y-4">
        <div className="h-8 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
