'use client';

import { useState, useEffect, useCallback, startTransition } from 'react';
import type { MonthlySnapshot } from '@/types/snapshot';
import { loadSnapshots } from '@/lib/storage';

export function useSnapshots() {
  const [snapshots, setSnapshots] = useState<MonthlySnapshot[]>([]);

  useEffect(() => {
    startTransition(() => setSnapshots(loadSnapshots()));
  }, []);

  const refreshSnapshots = useCallback(() => {
    setSnapshots(loadSnapshots());
  }, []);

  return { snapshots, refreshSnapshots };
}
