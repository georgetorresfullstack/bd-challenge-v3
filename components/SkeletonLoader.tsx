"use client";

export function SkeletonLoader() {
  return (
    <div className="flex flex-col md:flex-row gap-8 animate-pulse">
      {/* Media Skeleton */}
      <div className="w-full md:w-1/2 aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      
      {/* Content Skeleton */}
      <div className="w-full md:w-1/2 space-y-6">
        <div className="space-y-3">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-3/4" />
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/4" />
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-20" />
            <div className="flex gap-2">
              <div className="h-10 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-10 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-10 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-24" />
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full" />
        </div>
        
        <div className="space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-5/6" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-4/6" />
        </div>
      </div>
    </div>
  );
}
