export default function TableSkeleton({
  rows = 8,
  columns = 6,
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 px-5 py-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }).map(
              (_, columnIndex) => (
                <div
                  key={columnIndex}
                  className="h-4 animate-pulse rounded bg-slate-100"
                />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}