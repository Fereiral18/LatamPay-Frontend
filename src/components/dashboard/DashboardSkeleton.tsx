import { Skeleton } from "../ui/Skeleton";

export const DashboardSkeleton = () => (
  <section
    aria-busy="true"
    aria-live="polite"
    className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950 px-6 py-12 text-white"
  >
    <div className="relative z-10 container mx-auto max-w-6xl">
      {/* Header */}
      <div>
        <Skeleton className="h-10 w-72 md:h-12 md:w-96" />
        <Skeleton className="mt-3 h-4 w-56" />
      </div>

      {/* Balance */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-20 w-20 rounded-3xl" />
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mt-8">
        <Skeleton className="mb-4 h-6 w-44" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Monedas */}
      <div className="mt-10">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* Movimientos */}
      <div className="mt-10">
        <Skeleton className="mb-4 h-6 w-52" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default DashboardSkeleton;
