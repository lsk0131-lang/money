'use client';

import { useState, useEffect, startTransition } from 'react';
import type { Asset } from '@/types/asset';
import { useAssets } from '@/hooks/useAssets';
import { useSnapshots } from '@/hooks/useSnapshots';
import { createSeedAssets } from '@/lib/seed';
import { downloadAssetsAsExcel } from '@/lib/excel';
import DashboardHeader from '@/components/layout/DashboardHeader';
import SummaryGrid from '@/components/summary/SummaryGrid';
import AllocationChart from '@/components/charts/AllocationChart';
import TrendChart from '@/components/charts/TrendChart';
import AssetList from '@/components/assets/AssetList';
import AssetModal from '@/components/assets/AssetModal';

type ModalState =
  | { isOpen: false }
  | { isOpen: true; mode: 'add' }
  | { isOpen: true; mode: 'edit'; asset: Asset };

export default function DashboardPage() {
  const { assets, totalNet, byCategory, addAsset, updateAsset, deleteAsset, refreshStockPrices, loadSeedAssets } = useAssets();
  const { snapshots, refreshSnapshots } = useSnapshots();
  const [modal, setModal] = useState<ModalState>({ isOpen: false });
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSeedLoading, setIsSeedLoading] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);

  useEffect(() => { startTransition(() => setMounted(true)); }, []);

  function handleSubmit(data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) {
    if (modal.isOpen && modal.mode === 'edit') {
      updateAsset(modal.asset.id, data);
    } else {
      addAsset(data);
    }
    refreshSnapshots();
  }

  function handleDelete(id: string) {
    deleteAsset(id);
    refreshSnapshots();
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      await refreshStockPrices();
      refreshSnapshots();
      setRefreshedAt(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      alert('주가 갱신 중 오류가 발생했습니다. localhost:3333이 실행 중인지 확인해주세요.');
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleLoadSeed() {
    if (!confirm('PDF 자산 데이터를 불러올까요? 기존 데이터는 모두 대체됩니다.')) return;
    setIsSeedLoading(true);
    try {
      const seedAssets = await createSeedAssets();
      await loadSeedAssets(seedAssets);
      refreshSnapshots();
    } catch (e) {
      alert('데이터 불러오기 실패. localhost:3333이 실행 중인지 확인해주세요.');
      console.error(e);
    } finally {
      setIsSeedLoading(false);
    }
  }

  const hasStocks = assets.some((a) => a.stockInfo?.symbol);

  function handleDownload() {
    downloadAssetsAsExcel(assets);
  }

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <DashboardHeader
          onAdd={() => setModal({ isOpen: true, mode: 'add' })}
          onRefresh={handleRefresh}
          onDownload={handleDownload}
          isRefreshing={isRefreshing}
          hasStocks={hasStocks}
          hasAssets={assets.length > 0}
        />

        {refreshedAt && (
          <p className="text-xs text-gray-400 dark:text-zinc-500 -mt-4 mb-5 text-right">
            마지막 갱신: {refreshedAt}
          </p>
        )}

        <section className="mb-6">
          <SummaryGrid totalNet={totalNet} byCategory={byCategory} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3">자산 비율</h2>
            <AllocationChart byCategory={byCategory} />
          </div>
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3">월별 변동 추이</h2>
            <TrendChart snapshots={snapshots} />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3">자산 목록</h2>
          {assets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700 py-16 text-center">
              <p className="text-sm text-gray-400 dark:text-zinc-500 mb-4">아직 등록된 자산이 없습니다</p>
              <button
                onClick={handleLoadSeed}
                disabled={isSeedLoading}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSeedLoading ? '불러오는 중…' : '📄 자산 현황 불러오기 (PDF 기준)'}
              </button>
            </div>
          ) : (
            <AssetList
              assets={assets}
              onEdit={(asset) => setModal({ isOpen: true, mode: 'edit', asset })}
              onDelete={handleDelete}
            />
          )}
        </section>
      </div>

      <AssetModal
        isOpen={modal.isOpen}
        mode={modal.isOpen ? modal.mode : 'add'}
        asset={modal.isOpen && modal.mode === 'edit' ? modal.asset : undefined}
        onClose={() => setModal({ isOpen: false })}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
