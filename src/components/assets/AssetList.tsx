'use client';

// 자산 목록 테이블 — 카테고리 그룹핑
import type { Asset, AssetCategory } from '@/types/asset';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/asset';
import { formatKRW } from '@/lib/formatters';

const CATEGORIES: AssetCategory[] = ['cash', 'stock', 'futures', 'real_estate', 'loan', 'retirement'];

// 주식/ETF 금액 셀 — 기본: 평가금액, 호버: 매수/평가/손익/수익률 툴팁
function StockAmountCell({ amount, buyAmount }: { amount: number; buyAmount: number }) {
  const pnl = amount - buyAmount;
  const pnlRate = ((pnl / buyAmount) * 100).toFixed(2);
  const isProfit = pnl >= 0;

  return (
    <div className="relative group flex flex-col items-end">
      <span className="text-sm font-semibold text-gray-900 dark:text-white cursor-default">
        {formatKRW(amount)}
      </span>

      {/* 툴팁 */}
      <div className="absolute right-0 bottom-full mb-1.5 z-50 hidden group-hover:block w-52 rounded-xl bg-zinc-900 dark:bg-zinc-800 px-4 py-3 shadow-xl text-xs text-white space-y-1.5">
        <div className="flex justify-between">
          <span className="text-zinc-400">평가금액</span>
          <span className="font-medium">{formatKRW(amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">매수금액</span>
          <span className="font-medium">{formatKRW(buyAmount)}</span>
        </div>
        <div className="border-t border-zinc-700 pt-1.5 flex justify-between">
          <span className="text-zinc-400">평가손익</span>
          <span className={`font-semibold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
            {isProfit ? '+' : ''}{formatKRW(pnl)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">수익률</span>
          <span className={`font-semibold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
            {isProfit ? '+' : ''}{pnlRate}%
          </span>
        </div>
      </div>
    </div>
  );
}

interface AssetListProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

export default function AssetList({ assets, onEdit, onDelete }: AssetListProps) {
  if (assets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700 py-12 text-center text-sm text-gray-400 dark:text-zinc-500">
        아직 등록된 자산이 없습니다
      </div>
    );
  }

  const grouped = CATEGORIES.reduce<Record<AssetCategory, Asset[]>>(
    (acc, cat) => { acc[cat] = assets.filter((a) => a.category === cat); return acc; },
    {} as Record<AssetCategory, Asset[]>,
  );

  return (
    <div className="flex flex-col gap-4">
      {CATEGORIES.filter((cat) => grouped[cat].length > 0).map((cat) => (
        <div key={cat} className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
            <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">{CATEGORY_LABELS[cat]}</span>
          </div>
          <ul>
            {grouped[cat].map((asset, idx) => (
              <li
                key={asset.id}
                className={`flex items-center justify-between px-4 py-3 ${idx < grouped[cat].length - 1 ? 'border-b border-gray-50 dark:border-zinc-800' : ''}`}
              >
                <div className="flex items-center gap-2 min-w-0 truncate">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{asset.name}</span>
                  {asset.memo && (
                    <span className="text-xs text-gray-400 dark:text-zinc-500 flex-shrink-0">{asset.memo}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  {cat === 'stock' && asset.buyAmount != null ? (
                    <StockAmountCell amount={asset.amount} buyAmount={asset.buyAmount} />
                  ) : (
                    <span className={`text-sm font-semibold ${cat === 'loan' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {cat === 'loan' ? '-' : ''}{formatKRW(asset.amount)}
                    </span>
                  )}
                  <button
                    onClick={() => onEdit(asset)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => { if (confirm(`"${asset.name}"을(를) 삭제할까요?`)) onDelete(asset.id); }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
