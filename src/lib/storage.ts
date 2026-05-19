import type { Asset } from '@/types/asset';
import type { MonthlySnapshot } from '@/types/snapshot';

export const STORAGE_KEYS = {
  ASSETS: 'money_assets',
  SNAPSHOTS: 'money_snapshots',
} as const;

export function loadAssets(): Asset[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSETS);
    return raw ? (JSON.parse(raw) as Asset[]) : [];
  } catch {
    return [];
  }
}

export function saveAssets(assets: Asset[]): void {
  localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
}

export function loadSnapshots(): MonthlySnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
    return raw ? (JSON.parse(raw) as MonthlySnapshot[]) : [];
  } catch {
    return [];
  }
}

export function saveSnapshots(snapshots: MonthlySnapshot[]): void {
  localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(snapshots));
}
