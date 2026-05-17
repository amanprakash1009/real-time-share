/**
 * Skeleton — shimmer loading placeholder components.
 */
export const Skeleton = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-white/5 rounded-lg ${className}`}
  />
);

export const SkeletonCard = () => (
  <div className="glass rounded-2xl p-4 space-y-3">
    <Skeleton className="h-32 w-full rounded-xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
    <div className="flex gap-2 pt-1">
      <Skeleton className="h-7 w-20 rounded-lg" />
      <Skeleton className="h-7 w-16 rounded-lg" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-3 glass rounded-xl">
    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3.5 w-1/3" />
      <Skeleton className="h-3 w-1/5" />
    </div>
    <Skeleton className="h-7 w-20 rounded-lg" />
  </div>
);

export default Skeleton;
