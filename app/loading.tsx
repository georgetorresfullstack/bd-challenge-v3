import { ProductGridSkeleton } from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="py-12 px-4 md:px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            GPU Collection
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Explore our high-performance graphics cards. Click on any product to see more details.
          </p>
        </div>
      </header>

      <ProductGridSkeleton />

      <footer className="py-20 px-4 text-center border-t border-zinc-200 dark:border-zinc-800 text-zinc-400 text-sm">
        <p>© 2026 Bryt Designs Challenge. Designed with Motion & Shopify.</p>
      </footer>
    </main>
  );
}
