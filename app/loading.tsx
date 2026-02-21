export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-6 w-56 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl border border-black/5 bg-white shadow-md dark:border-white/10 dark:bg-neutral-900"
          />
        ))}
      </div>
    </div>
  );
}
