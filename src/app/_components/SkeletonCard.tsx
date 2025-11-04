const SkeletonCard = () => (
  <div className="flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-warmgray/50 bg-white p-6">
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 animate-pulse rounded-lg bg-gradient-to-br from-warmgray/60 to-warmgray/40" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 animate-pulse rounded-full bg-gradient-to-r from-warmgray/60 via-warmgray/50 to-warmgray/60 bg-[length:200%_100%]" />
        <div className="h-3 w-24 animate-pulse rounded-full bg-gradient-to-r from-warmgray/50 via-warmgray/40 to-warmgray/50 bg-[length:200%_100%]" />
      </div>
      <div className="h-6 w-16 animate-pulse rounded-full bg-warmgray/50" />
    </div>
    <div className="space-y-2">
      <div className="h-6 w-full animate-pulse rounded bg-gradient-to-r from-warmgray/60 via-warmgray/50 to-warmgray/60 bg-[length:200%_100%]" />
      <div className="h-6 w-5/6 animate-pulse rounded bg-gradient-to-r from-warmgray/50 via-warmgray/40 to-warmgray/50 bg-[length:200%_100%]" />
    </div>
    <div className="h-48 w-full animate-pulse rounded-xl bg-gradient-to-br from-warmgray/60 to-warmgray/40" />
    <div className="mt-auto flex items-center justify-between border-t border-warmgray/40 pt-4">
      <div className="flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-full bg-warmgray/50" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-warmgray/50" />
      </div>
      <div className="h-8 w-24 animate-pulse rounded-full bg-warmgray/50" />
    </div>
  </div>
);

export default SkeletonCard;
