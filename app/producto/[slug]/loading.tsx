export default function ProductoLoading() {
  return (
    <main className="max-w-4xl mx-auto p-6 md:p-10 animate-pulse">
      <div className="h-4 w-32 rounded bg-muted mb-6" />

      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="w-full md:w-1/3 aspect-square rounded-xl bg-muted" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="h-8 w-3/4 rounded bg-muted" />
          <div className="h-10 w-1/3 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
        </div>
      </div>

      <div className="mb-10">
        <div className="h-5 w-48 rounded bg-muted mb-4" />
        <div className="h-32 w-full rounded-xl bg-muted" />
      </div>

      <div className="mb-8">
        <div className="h-5 w-56 rounded bg-muted mb-4" />
        <div className="h-40 w-full rounded-xl bg-muted" />
      </div>
    </main>
  );
}

