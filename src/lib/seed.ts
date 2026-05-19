import type { Asset, StockInfo } from '@/types/asset';

const STOCK_API = 'http://localhost:3333';

interface StockEntry {
  name: string;
  symbol: string;
  market: 'KR' | 'US';
  qty: number;
  buyAmount: number;   // 원화 기준
  evalAmount: number;  // PDF 기준 평가금액 (원화)
}

// 포트폴리오_2026-05-19.pdf 기준
const STOCK_ENTRIES: StockEntry[] = [
  { name: 'SK하이닉스',                      symbol: '000660_KS', market: 'KR', qty: 25,   buyAmount: 49_415_000, evalAmount: 43_875_000 },
  { name: '삼성전자',                         symbol: '005930_KS', market: 'KR', qty: 123,  buyAmount: 32_804_961, evalAmount: 33_763_500 },
  { name: 'TIGER 반도체TOP10',               symbol: '396500_KS', market: 'KR', qty: 500,  buyAmount: 22_875_000, evalAmount: 21_785_000 },
  { name: 'TIGER 미국필라델피아반도체나스닥',  symbol: '381180_KS', market: 'KR', qty: 200,  buyAmount:  8_651_000, evalAmount:  8_799_000 },
  { name: 'KODEX 미국S&P500',                symbol: '379800_KS', market: 'KR', qty: 500,  buyAmount: 12_195_000, evalAmount: 12_570_000 },
  { name: 'TIGER 미국나스닥100',              symbol: '133690_KS', market: 'KR', qty: 50,   buyAmount:  9_315_000, evalAmount:  9_626_000 },
  { name: 'HLB',                             symbol: '028300_KS', market: 'KR', qty: 1500, buyAmount: 93_099_000, evalAmount: 73_200_000 },
  { name: '에스티큐브',                       symbol: '052020_KS', market: 'KR', qty: 520,  buyAmount: 10_008_960, evalAmount:  7_919_600 },
  { name: '카카오',                           symbol: '035720_KS', market: 'KR', qty: 425,  buyAmount: 12_662_450, evalAmount: 17_658_750 },
  { name: 'INVESCO QQQ TRUST',              symbol: 'QQQ_US',    market: 'US', qty: 10,   buyAmount: 10_469_290, evalAmount: 10_631_260 },
  { name: 'VANGUARD S&P 500',               symbol: 'VOO_US',    market: 'US', qty: 5,    buyAmount:  4_987_990, evalAmount:  5_112_530 },
  { name: '알파벳 A',                         symbol: 'GOOGL_US',  market: 'US', qty: 10,   buyAmount:  5_780_440, evalAmount:  5_978_310 },
];

export async function createSeedAssets(): Promise<Asset[]> {
  const now = new Date().toISOString();
  const id = () => crypto.randomUUID();

  const symbols = STOCK_ENTRIES.map((s) => s.symbol);
  const [priceRes, exRes] = await Promise.all([
    fetch(`${STOCK_API}/api/prices?symbols=${symbols.join(',')}`),
    fetch(`${STOCK_API}/api/exchange`),
  ]);

  const prices: Record<string, { price: number; error?: string }> = await priceRes.json();
  const { usdkrw }: { usdkrw: number } = await exRes.json();

  function makeStockInfo(entry: StockEntry): StockInfo | undefined {
    const p = prices[entry.symbol];
    if (!p || p.error) return undefined;
    return {
      symbol: entry.symbol,
      market: entry.market,
      qty: entry.qty,
      refPrice: p.price,
      ...(entry.market === 'US' && { refExRate: usdkrw }),
    };
  }

  return [
    // 부동산
    { id: id(), name: '전세자금',           category: 'real_estate', amount: 1_500_000_000, createdAt: now, updatedAt: now },

    // 예적금
    { id: id(), name: '대섭 청약',          category: 'cash',        amount:    10_500_000, createdAt: now, updatedAt: now },
    { id: id(), name: '슬기 청약',          category: 'cash',        amount:    10_000_000, createdAt: now, updatedAt: now },
    { id: id(), name: '대섭 IRP',           category: 'cash',        amount:    58_000_000, createdAt: now, updatedAt: now },
    { id: id(), name: '슬기 IRP',           category: 'cash',        amount:    30_000_000, createdAt: now, updatedAt: now },

    // 선물 투자 (고정)
    { id: id(), name: '선물 투자',          category: 'futures',     amount:   200_000_000, createdAt: now, updatedAt: now },

    // 스톡옵션 (고정)
    { id: id(), name: '카카오 스톡옵션',    category: 'stock',       amount:    70_000_000, memo: '미행사/6만원 행사가', createdAt: now, updatedAt: now },

    // 주식/ETF
    ...STOCK_ENTRIES.map((entry) => ({
      id: id(),
      name: entry.name,
      category: 'stock' as const,
      amount: entry.evalAmount,
      buyAmount: entry.buyAmount,
      createdAt: now,
      updatedAt: now,
      stockInfo: makeStockInfo(entry),
    })),

    // 자녀저축
    { id: id(), name: '재하 주식/청약',     category: 'cash',        amount:    15_000_000, createdAt: now, updatedAt: now },
    { id: id(), name: '재이 주식/청약',     category: 'cash',        amount:    15_000_000, createdAt: now, updatedAt: now },

    // 대출
    { id: id(), name: '전세 자금 대출',     category: 'loan',        amount:   500_000_000, createdAt: now, updatedAt: now },
    { id: id(), name: '슬기 회사 대출',     category: 'loan',        amount:    60_000_000, createdAt: now, updatedAt: now },
    { id: id(), name: '대섭 마이너스',      category: 'loan',        amount:    50_000_000, createdAt: now, updatedAt: now },
    { id: id(), name: '대섭 농협 마이너스', category: 'loan',        amount:    25_000_000, createdAt: now, updatedAt: now },

    // 퇴직금
    { id: id(), name: '대섭 퇴직금',        category: 'retirement',  amount:   185_507_620, createdAt: now, updatedAt: now },
    { id: id(), name: '슬기 퇴직금',        category: 'retirement',  amount:   146_641_760, createdAt: now, updatedAt: now },
  ];
}
