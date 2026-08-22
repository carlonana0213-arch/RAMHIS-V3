export default function PatientCardSkeleton() {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6">
      <div className="animate-pulse space-y-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-slate-200" />

          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="h-4 w-24 rounded bg-slate-100" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 rounded-xl bg-slate-100" />
          <div className="h-16 rounded-xl bg-slate-100" />
        </div>

        <div className="h-12 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}