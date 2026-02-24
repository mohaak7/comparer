export default function RootLoading() {
  return (
    <main className="px-6 py-10 md:px-12 md:py-14 max-w-6xl mx-auto animate-pulse">
      <section className="mb-10 md:mb-12">
        <div className="h-8 md:h-10 w-2/3 md:w-1/2 rounded-lg bg-muted mb-3" />
        <div className="h-4 w-full md:w-2/3 rounded-lg bg-muted mb-2" />
        <div className="h-4 w-3/4 md:w-1/2 rounded-lg bg-muted mb-6" />
        <div className="h-10 w-full max-w-xl rounded-full bg-muted" />
      </section>

      <section className="mb-10 md:mb-12">
        <div className="h-6 w-48 rounded-lg bg-muted mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card p-4 flex flex-col gap-3"
            >
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-5/6 rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="h-6 w-40 rounded-lg bg-muted mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card p-4 flex flex-col gap-4"
            >
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-8 w-1/2 rounded bg-muted" />
              <div className="h-9 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

