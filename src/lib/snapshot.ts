import type { Asset, AssetCategory } from '@/types/asset';
import type { MonthlySnapshot } from '@/types/snapshot';

const CATEGORIES: AssetCategory[] = ['cash', 'stock', 'futures', 'real_estate', 'loan', 'retirement'];

export function computeSnapshot(assets: Asset[], yearMonth: string): MonthlySnapshot {
  const breakdown = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<AssetCategory, number>;

  for (const asset of assets) {
    if (asset.category === 'loan') {
      breakdown.loan -= asset.amount;
    } else {
      breakdown[asset.category] += asset.amount;
    }
  }

  const totalGross = CATEGORIES.filter((c) => c !== 'loan').reduce((s, c) => s + breakdown[c], 0);
  const totalNet = totalGross + breakdown.loan;

  return { yearMonth, totalNet, totalGross, breakdown, snapshotAt: new Date().toISOString() };
}

export function upsertSnapshot(
  snapshots: MonthlySnapshot[],
  next: MonthlySnapshot,
  maxMonths = 24,
): MonthlySnapshot[] {
  const idx = snapshots.findIndex((s) => s.yearMonth === next.yearMonth);
  const updated = idx >= 0
    ? snapshots.map((s, i) => (i === idx ? next : s))
    : [...snapshots, next];

  return updated
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth))
    .slice(-maxMonths);
}
