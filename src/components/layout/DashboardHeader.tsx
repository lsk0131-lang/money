// 대시보드 상단 헤더
interface DashboardHeaderProps {
  onAdd: () => void;
  onRefresh: () => void;
  onDownload: () => void;
  isRefreshing: boolean;
  hasStocks: boolean;
  hasAssets: boolean;
}

export default function DashboardHeader({
  onAdd,
  onRefresh,
  onDownload,
  isRefreshing,
  hasStocks,
  hasAssets,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">내 자산 현황</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">자산을 한눈에 확인하고 관리하세요</p>
      </div>
      <div className="flex items-center gap-2">
        {hasStocks && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 px-4 py-2.5 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? '갱신 중…' : '주가 갱신'}
          </button>
        )}
        {hasAssets && (
          <button
            onClick={onDownload}
            className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            엑셀 다운로드
          </button>
        )}
        <button
          onClick={onAdd}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + 자산 추가
        </button>
      </div>
    </header>
  );
}
