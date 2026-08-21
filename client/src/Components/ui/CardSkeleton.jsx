function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Title */}
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />

              {/* Number */}
              <div className="mt-3 h-9 w-16 animate-pulse rounded bg-slate-200" />

              {/* Description */}
              <div className="mt-3 h-3 w-36 animate-pulse rounded bg-slate-200" />
            </div>

            {/* Icon */}
            <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardSkeleton;