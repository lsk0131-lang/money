// 총 자산 + 카테고리별 요약 카드 그리드
import SummaryCard from './SummaryCard';
import { CATEGORY_LABELS, CATEGORY_COLORS, type AssetCategory } from '@/types/asset';

const CATEGORIES: AssetCategory[] = ['cash', 'stock', 'futures', 'real_estate', 'loan', 'retirement'];

interface SummaryGridProps {
  totalNet: number;
  byCategory: Partial<Record<AssetCategory, number>>;
}

export default function SummaryGrid({ totalNet, byCategory }: SummaryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <SummaryCard label="총 순자산" amount={totalNet} isTotal />
      {CATEGORIES.map((cat) => (
        <SummaryCard
          key={cat}
          label={CATEGORY_LABELS[cat]}
          amount={byCategory[cat] ?? 0}
          isNegative={cat === 'loan'}
          color={CATEGORY_COLORS[cat]}
        />
      ))}
    </div>
  );
}
