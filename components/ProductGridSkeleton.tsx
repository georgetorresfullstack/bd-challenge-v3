export function ProductGridSkeleton() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-8 max-w-7xl mx-auto py-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800 animate-pulse"
          >
            <div className="aspect-square bg-zinc-200 dark:bg-zinc-800" />
            <div className="p-4 flex flex-col gap-3">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
