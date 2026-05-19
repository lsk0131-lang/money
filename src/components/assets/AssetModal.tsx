'use client';

// 자산 추가/편집 모달
import { useEffect } from 'react';
import type { Asset } from '@/types/asset';
import AssetForm from './AssetForm';

type FormData = Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>;

interface AssetModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  asset?: Asset;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export default function AssetModal({ isOpen, mode, asset, onClose, onSubmit }: AssetModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
          {mode === 'add' ? '자산 추가' : '자산 수정'}
        </h2>
        <AssetForm
          initialData={asset}
          onSubmit={(data) => { onSubmit(data); onClose(); }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
