const SkeletonCard = () => (
  <div className="flex h-full flex-col gap-3 rounded-2xl border border-warmgray/50 bg-white p-5">
    <div className="h-4 w-32 animate-pulse rounded-full bg-warmgray/80" />
    <div className="h-3 w-20 animate-pulse rounded-full bg-warmgray/70" />
    <div className="h-6 w-full animate-pulse rounded bg-warmgray/70" />
    <div className="h-6 w-5/6 animate-pulse rounded bg-warmgray/60" />
    <div className="h-40 w-full animate-pulse rounded-xl bg-warmgray/60" />
    <div className="mt-auto flex gap-2">
      <div className="h-5 w-16 animate-pulse rounded-full bg-warmgray/70" />
      <div className="h-5 w-14 animate-pulse rounded-full bg-warmgray/70" />
    </div>
  </div>
);

export default SkeletonCard;
