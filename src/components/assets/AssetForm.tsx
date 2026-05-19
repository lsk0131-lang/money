// 자산 추가/편집 폼
'use client';

import { useState } from 'react';
import type { Asset, AssetCategory } from '@/types/asset';
import { CATEGORY_LABELS } from '@/types/asset';

const CATEGORIES: AssetCategory[] = ['cash', 'stock', 'futures', 'real_estate', 'loan', 'retirement'];

type FormData = Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>;

interface AssetFormProps {
  initialData?: Partial<Asset>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export default function AssetForm({ initialData, onSubmit, onCancel }: AssetFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [category, setCategory] = useState<AssetCategory>(initialData?.category ?? 'cash');
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? '');
  const [buyAmount, setBuyAmount] = useState(initialData?.buyAmount?.toString() ?? '');
  const [memo, setMemo] = useState(initialData?.memo ?? '');
  const [error, setError] = useState('');

  const isStock = category === 'stock';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('자산명을 입력해주세요'); return; }
    const parsed = Number(amount.replace(/,/g, ''));
    if (isNaN(parsed) || parsed <= 0) { setError('금액을 올바르게 입력해주세요'); return; }
    const parsedBuy = buyAmount ? Number(buyAmount.replace(/,/g, '')) : undefined;
    if (parsedBuy !== undefined && (isNaN(parsedBuy) || parsedBuy <= 0)) {
      setError('매수금액을 올바르게 입력해주세요'); return;
    }
    onSubmit({
      name: name.trim(),
      category,
      amount: parsed,
      buyAmount: isStock ? parsedBuy : undefined,
      memo: memo.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">자산명</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 토스 통장, 삼성전자"
          className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">카테고리</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as AssetCategory)}
          className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
          ))}
        </select>
      </div>
      {isStock ? (
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">매수금액 (원)</label>
            <input
              type="number"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              placeholder="0"
              min="0"
              className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">평가금액 (원)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">금액 (원)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min="0"
            className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">메모 (선택)</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="간단한 메모"
          rows={2}
          className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-200 dark:border-zinc-700 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {initialData?.id ? '수정' : '추가'}
        </button>
      </div>
    </form>
  );
}
