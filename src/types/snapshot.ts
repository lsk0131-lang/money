import type { AssetCategory } from './asset';

export interface MonthlySnapshot {
  yearMonth: string;
  totalNet: number;
  totalGross: number;
  breakdown: Record<AssetCategory, number>;
  snapshotAt: string;
}
