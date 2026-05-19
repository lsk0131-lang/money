'use client';

import { useMemo, useState, useEffect, useCallback, startTransition } from 'react';
import type { Asset, AssetCategory } from '@/types/asset';
import { loadAssets, saveAssets, loadSnapshots, saveSnapshots } from '@/lib/storage';
import { computeSnapshot, upsertSnapshot } from '@/lib/snapshot';

const STOCK_API = 'http://localhost:3333';

// PDF 포트폴리오 기준 종목별 수량 + 매수금액
const STOCK_MIGRATION_DATA: Record<string, { qty: number; buyAmount: number }> = {
  '000660_KS': { qty: 25,   buyAmount: 49_415_000  },
  '005930_KS': { qty: 123,  buyAmount: 32_804_961  },
  '396500_KS': { qty: 500,  buyAmount: 22_875_000  },
  '381180_KS': { qty: 200,  buyAmount:  8_651_000  },
  '379800_KS': { qty: 500,  buyAmount: 12_195_000  },
  '133690_KS': { qty: 50,   buyAmount:  9_315_000  },
  '028300_KS': { qty: 1500, buyAmount: 93_099_000  },
  '052020_KS': { qty: 520,  buyAmount: 10_008_960  },
  '035720_KS': { qty: 425,  buyAmount: 12_662_450  },
  'QQQ_US':    { qty: 10,   buyAmount: 10_469_290  },
  'VOO_US':    { qty: 5,    buyAmount:  4_987_990  },
  'GOOGL_US':  { qty: 10,   buyAmount:  5_780_440  },
};

function migrateAssets(assets: Asset[]): { assets: Asset[]; changed: boolean } {
  let changed = false;
  const migrated = assets.map((a) => {
    let updated = { ...a };

    // 선물 투자 카테고리 마이그레이션
    if (updated.category === 'stock' && updated.name === '선물 투자') {
      updated = { ...updated, category: 'futures' as const };
      changed = true;
    }

    // 주식 항목에 qty + buyAmount 반영
    const symbol = updated.stockInfo?.symbol;
    if (symbol) {
      const data = STOCK_MIGRATION_DATA[symbol];
      if (data) {
        const needsUpdate =
          updated.buyAmount !== data.buyAmount ||
          updated.stockInfo!.qty !== data.qty;
        if (needsUpdate) {
          updated = {
            ...updated,
            buyAmount: data.buyAmount,
            stockInfo: { ...updated.stockInfo!, qty: data.qty },
          };
          changed = true;
        }
      }
    }

    return updated;
  });
  return { assets: migrated, changed };
}

function currentYearMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function triggerSnapshot(assets: Asset[]): void {
  const snapshots = loadSnapshots();
  const next = computeSnapshot(assets, currentYearMonth());
  saveSnapshots(upsertSnapshot(snapshots, next));
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    startTransition(() => {
      const { assets: migrated, changed } = migrateAssets(loadAssets());
      if (changed) {
        saveAssets(migrated);
        triggerSnapshot(migrated);
      }
      setAssets(migrated);
    });
  }, []);

  const mutate = useCallback((next: Asset[]) => {
    saveAssets(next);
    triggerSnapshot(next);
    setAssets(next);
  }, []);

  const addAsset = useCallback(
    (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const asset: Asset = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
      mutate([...assets, asset]);
    },
    [assets, mutate],
  );

  const updateAsset = useCallback(
    (id: string, data: Partial<Omit<Asset, 'id' | 'createdAt'>>) => {
      mutate(
        assets.map((a) =>
          a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a,
        ),
      );
    },
    [assets, mutate],
  );

  const deleteAsset = useCallback(
    (id: string) => {
      mutate(assets.filter((a) => a.id !== id));
    },
    [assets, mutate],
  );

  const refreshStockPrices = useCallback(async (): Promise<void> => {
    const stockAssets = assets.filter((a) => a.stockInfo?.symbol);
    if (!stockAssets.length) return;

    const symbols = [...new Set(stockAssets.map((a) => a.stockInfo!.symbol))];
    const hasUS = stockAssets.some((a) => a.stockInfo?.market === 'US');

    const [priceRes, exRes] = await Promise.all([
      fetch(`${STOCK_API}/api/prices?symbols=${symbols.join(',')}`),
      hasUS ? fetch(`${STOCK_API}/api/exchange`) : Promise.resolve(null),
    ]);

    const prices: Record<string, { price: number; error?: string }> = await priceRes.json();
    const usdkrw: number = exRes ? (await exRes.json()).usdkrw : 1500;

    const now = new Date().toISOString();
    const updated = assets.map((asset) => {
      if (!asset.stockInfo?.symbol) return asset;
      const { symbol, market, qty, refPrice, refExRate } = asset.stockInfo;
      const priceData = prices[symbol];
      if (!priceData || priceData.error) return asset;

      const newPriceNative = priceData.price;
      let newAmount: number;

      if (qty) {
        // qty 기반 정확한 계산
        newAmount = market === 'KR'
          ? Math.round(qty * newPriceNative)
          : Math.round(qty * newPriceNative * usdkrw);
      } else {
        // qty 없는 구형 데이터: 비율 계산 fallback
        if (market === 'KR') {
          newAmount = Math.round((asset.amount / refPrice) * newPriceNative);
        } else {
          const prevExRate = refExRate ?? 1500;
          newAmount = Math.round((asset.amount / (refPrice * prevExRate)) * newPriceNative * usdkrw);
        }
      }

      return {
        ...asset,
        amount: newAmount,
        updatedAt: now,
        stockInfo: {
          ...asset.stockInfo,
          refPrice: newPriceNative,
          ...(market === 'US' && { refExRate: usdkrw }),
        },
      };
    });

    mutate(updated);
  }, [assets, mutate]);

  const loadSeedAssets = useCallback(
    async (seedAssets: Asset[]): Promise<void> => {
      mutate(seedAssets);
    },
    [mutate],
  );

  const { totalGross, totalNet, byCategory } = useMemo(() => {
    const byCategory = {} as Record<AssetCategory, number>;
    let totalGross = 0;

    for (const asset of assets) {
      if (asset.category === 'loan') {
        byCategory.loan = (byCategory.loan ?? 0) + asset.amount;
      } else {
        byCategory[asset.category] = (byCategory[asset.category] ?? 0) + asset.amount;
        totalGross += asset.amount;
      }
    }

    const totalNet = totalGross - (byCategory.loan ?? 0);
    return { totalGross, totalNet, byCategory };
  }, [assets]);

  return {
    assets,
    totalGross,
    totalNet,
    byCategory,
    addAsset,
    updateAsset,
    deleteAsset,
    refreshStockPrices,
    loadSeedAssets,
  };
}
