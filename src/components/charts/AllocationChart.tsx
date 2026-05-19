'use client';

// 자산 카테고리별 비율 도넛 차트
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORY_LABELS, CATEGORY_COLORS, type AssetCategory } from '@/types/asset';
import { formatKRW } from '@/lib/formatters';

interface AllocationChartProps {
  byCategory: Partial<Record<AssetCategory, number>>;
}

const CATEGORIES: AssetCategory[] = ['cash', 'stock', 'futures', 'real_estate', 'retirement'];

export default function AllocationChart({ byCategory }: AllocationChartProps) {
  const data = CATEGORIES
    .map((cat) => ({ name: CATEGORY_LABELS[cat], value: byCategory[cat] ?? 0, color: CATEGORY_COLORS[cat] }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-zinc-500 text-sm">
        자산을 추가하면 비율 차트가 표시됩니다
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatKRW(Number(value)), '금액']}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
        />
        <Legend
          formatter={(value) => <span className="text-sm text-gray-700 dark:text-zinc-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
