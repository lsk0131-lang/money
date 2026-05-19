import * as XLSX from 'xlsx';
import type { Asset } from '@/types/asset';
import { CATEGORY_LABELS } from '@/types/asset';
import { formatKRW } from './formatters';

export function downloadAssetsAsExcel(assets: Asset[]): void {
  const rows = assets.map((a) => ({
    자산명: a.name,
    카테고리: CATEGORY_LABELS[a.category],
    금액: a.amount,
    '금액(표시)': formatKRW(a.category === 'loan' ? -a.amount : a.amount),
    메모: a.memo ?? '',
    등록일: a.createdAt.slice(0, 10),
    수정일: a.updatedAt.slice(0, 10),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  // 열 너비 설정
  ws['!cols'] = [
    { wch: 28 }, // 자산명
    { wch: 12 }, // 카테고리
    { wch: 16 }, // 금액
    { wch: 18 }, // 금액(표시)
    { wch: 20 }, // 메모
    { wch: 12 }, // 등록일
    { wch: 12 }, // 수정일
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '자산현황');

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `자산현황_${date}.xlsx`);
}
