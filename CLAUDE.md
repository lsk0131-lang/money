# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

바이브코딩으로 만드는 나만의 자산관리 서비스. Next.js로 만들었고 Vercel에 배포되어 있어요.

- GitHub 저장소: https://github.com/lsk0131-lang/money
- 기본 브랜치: `main` (배포는 항상 main 브랜치에서)

## 기술 스택

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (`@import "tailwindcss"` 방식 — 기존 `@tailwind base/components/utilities` 지시어 사용 안 함)
- Geist Sans / Geist Mono 폰트 (CSS 변수 `--font-geist-sans`, `--font-geist-mono` 로 적용)
- 다크모드: `prefers-color-scheme` 미디어 쿼리 기반 (클래스 기반 아님)
- recharts — 도넛 차트(PieChart), 월별 추이(ComposedChart)
- xlsx — 엑셀 다운로드
- Vercel 배포

## 자주 쓰는 명령어

- `npm run dev` — 개발 서버 시작 (http://localhost:3000)
- `npm run build` — 배포용 빌드
- `npm run lint` — ESLint 검사

## 아키텍처

### 라우트

```
/           → src/app/page.tsx          랜딩 페이지 (Server Component)
/dashboard  → src/app/dashboard/page.tsx  대시보드 ('use client', 모든 상태 클라이언트)
```

### 데이터 흐름

모든 데이터는 브라우저 localStorage에 저장. 서버 없음.

```
localStorage
  money_assets     → Asset[]           자산 전체 목록
  money_snapshots  → MonthlySnapshot[] 월별 스냅샷 (최대 24개월, 자산 변경 시 자동 upsert)
```

### 핵심 타입 (`src/types/`)

```ts
// AssetCategory: 'cash' | 'stock' | 'futures' | 'real_estate' | 'loan' | 'retirement'

interface Asset {
  id, name, category, amount  // amount = 평가금액 (합산·차트에 사용)
  buyAmount?                  // 매수금액 (주식/ETF 전용, 툴팁에 표시)
  memo?, createdAt, updatedAt
  stockInfo?: StockInfo       // 주가 갱신 가능 종목만
}

interface StockInfo {
  symbol   // API 심볼 (예: '005930_KS', 'QQQ_US')
  market   // 'KR' | 'US'
  qty      // 보유 수량 — 갱신 시 qty × 현재가로 계산
  refPrice // 마지막 갱신 시점 가격 (KR: KRW, US: USD)
  refExRate? // 마지막 갱신 USD/KRW (US 전용)
}
```

### 주요 파일

| 파일 | 역할 |
|---|---|
| `src/hooks/useAssets.ts` | 자산 CRUD + 주가 갱신 + 자동 마이그레이션. 대시보드의 단일 상태 진실의 원천 |
| `src/hooks/useSnapshots.ts` | 월별 스냅샷 읽기 + refreshSnapshots |
| `src/lib/storage.ts` | localStorage 접근 단일 진입점 (STORAGE_KEYS 상수) |
| `src/lib/snapshot.ts` | computeSnapshot, upsertSnapshot 순수 함수 |
| `src/lib/seed.ts` | PDF 자산현황 기준 초기 데이터 (async, 주가 API 호출해 refPrice 세팅) |
| `src/lib/excel.ts` | 자산 목록 엑셀 다운로드 (xlsx) |
| `src/lib/formatters.ts` | formatKRW, formatKRWCompact (억/만 단위) |

### 주가 갱신 (`refreshStockPrices`)

- API: `http://localhost:3333/api/prices?symbols=...` → `{ [symbol]: { price } }`
- API: `http://localhost:3333/api/exchange` → `{ usdkrw }`
- KR 주식: `amount = qty × KRW가격`
- US 주식: `amount = qty × USD가격 × usdkrw`
- `stockInfo.qty`가 없는 구형 데이터는 비율 계산 fallback

### 자동 마이그레이션 (`useAssets.ts`)

앱 로드 시 localStorage 데이터를 검사해 자동 적용:
1. `선물 투자` 항목: `category: 'stock'` → `'futures'`
2. 주식 종목에 `buyAmount`, `stockInfo.qty` 반영 (PDF 포트폴리오 기준값 하드코딩)

## 주의사항

- `public/` 폴더의 이미지는 직접 올린 것이라 함부로 삭제하지 말 것
- `layout.tsx`의 `metadata`는 "자산관리 포트폴리오"로 설정되어 있음
- 카테고리 추가/삭제 시 수정 필요한 파일: `src/types/asset.ts`, `src/lib/snapshot.ts`, `src/components/summary/SummaryGrid.tsx`, `src/components/charts/AllocationChart.tsx`, `src/components/assets/AssetList.tsx`, `src/components/assets/AssetForm.tsx`

## 코딩 스타일

- 컴포넌트 이름은 한국어 주석으로 설명
- 코드 설명은 항상 한국어로 작성
- 버튼 색상은 항상 브랜드 컬러인 파란색(`bg-blue-600`)으로 통일
- 금액 표기: `원` 단위 (₩ 사용 안 함) — `formatKRW()` 사용
