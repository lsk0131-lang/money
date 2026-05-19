// 자산 요약 카드 — 카테고리 1개 또는 총 자산 표시
import { formatKRW } from '@/lib/formatters';

interface SummaryCardProps {
  label: string;
  amount: number;
  isNegative?: boolean;
  isTotal?: boolean;
  color?: string;
}

export default function SummaryCard({ label, amount, isNegative, isTotal, color }: SummaryCardProps) {
  const displayAmount = isNegative ? -amount : amount;
  const amountColor = isNegative
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-900 dark:text-white';

  return (
    <div
      className={`rounded-2xl p-5 flex flex-col gap-2 ${
        isTotal
          ? 'bg-blue-600 text-white col-span-2 sm:col-span-3'
          : 'bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800'
      }`}
    >
      <div className="flex items-center gap-2">
        {color && !isTotal && (
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        )}
        <span className={`text-sm font-medium ${isTotal ? 'text-blue-100' : 'text-gray-500 dark:text-zinc-400'}`}>
          {label}
        </span>
      </div>
      <span
        className={`text-xl font-bold tracking-tight ${
          isTotal ? 'text-white text-2xl' : amountColor
        }`}
      >
        {formatKRW(displayAmount)}
      </span>
    </div>
  );
}
