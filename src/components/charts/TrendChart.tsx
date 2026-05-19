'use client';

// 월별 순자산 변동 추이 차트
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { MonthlySnapshot } from '@/types/snapshot';
import { formatKRWCompact } from '@/lib/formatters';

interface TrendChartProps {
  snapshots: MonthlySnapshot[];
}

function toMonthLabel(yearMonth: string): string {
  const [, month] = yearMonth.split('-');
  return `${parseInt(month)}월`;
}

export default function TrendChart({ snapshots }: TrendChartProps) {
  const recent = snapshots.slice(-12);

  if (recent.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-zinc-500 text-sm">
        자산을 추가하면 월별 추이가 표시됩니다
      </div>
    );
  }

  const data = recent.map((s) => ({
    month: toMonthLabel(s.yearMonth),
    총자산: s.totalGross,
    순자산: s.totalNet,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatKRWCompact} tick={{ fontSize: 12 }} width={60} />
        <Tooltip
          formatter={(value, name) => [formatKRWCompact(Number(value)), String(name)]}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
        />
        <Legend />
        <Bar dataKey="총자산" fill="#bfdbfe" radius={[4, 4, 0, 0]} />
        <Line type="monotone" dataKey="순자산" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
