export type AssetCategory =
  | 'cash'
  | 'stock'
  | 'futures'
  | 'real_estate'
  | 'loan'
  | 'retirement';

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  cash: '현금/예적금',
  stock: '주식/ETF',
  futures: '선물투자',
  real_estate: '부동산',
  loan: '대출',
  retirement: '퇴직금',
};

export const CATEGORY_COLORS: Record<AssetCategory, string> = {
  cash: '#2563eb',
  stock: '#16a34a',
  futures: '#f59e0b',
  real_estate: '#d97706',
  loan: '#dc2626',
  retirement: '#0891b2',
};

export interface StockInfo {
  symbol: string;
  market: 'KR' | 'US';
  qty: number;         // 보유 수량
  refPrice: number;    // 마지막 갱신 시점 가격 (KR: KRW, US: USD)
  refExRate?: number;  // 마지막 갱신 시점 USD/KRW (US 전용)
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  amount: number;      // 평가금액 (합산·차트에 사용)
  buyAmount?: number;  // 매수금액 (주식/ETF 전용)
  memo?: string;
  createdAt: string;
  updatedAt: string;
  stockInfo?: StockInfo;
}
