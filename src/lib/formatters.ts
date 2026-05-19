const numberFormatter = new Intl.NumberFormat('ko-KR');

export function formatKRW(amount: number): string {
  return `${numberFormatter.format(amount)}원`;
}

export function formatKRWCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1_0000_0000) return `${sign}${(abs / 1_0000_0000).toFixed(1)}억`;
  if (abs >= 1_0000) return `${sign}${(abs / 1_0000).toFixed(0)}만`;
  return formatKRW(amount);
}
