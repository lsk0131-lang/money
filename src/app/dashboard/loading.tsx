// 대시보드 로딩 스켈레톤 UI
export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-40 rounded-xl bg-gray-200 dark:bg-zinc-800" />
          <div className="h-10 w-24 rounded-xl bg-gray-200 dark:bg-zinc-800" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`h-24 rounded-2xl bg-gray-200 dark:bg-zinc-800 ${i === 0 ? 'col-span-2 sm:col-span-3' : ''}`} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="h-72 rounded-2xl bg-gray-200 dark:bg-zinc-800" />
          <div className="h-72 rounded-2xl bg-gray-200 dark:bg-zinc-800" />
        </div>
        <div className="h-48 rounded-2xl bg-gray-200 dark:bg-zinc-800" />
      </div>
    </main>
  );
}
