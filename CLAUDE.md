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
- Vercel 배포

## 자주 쓰는 명령어

- `npm run dev` — 개발 서버 시작 (http://localhost:3000)
- `npm run build` — 배포용 빌드
- `npm run lint` — ESLint 검사

## 아키텍처

`src/app/` 이하 App Router 구조. 현재 라우트:

- `/` → `src/app/page.tsx` (랜딩 페이지)
- 전역 레이아웃: `src/app/layout.tsx` (폰트·메타데이터 설정)
- 전역 스타일: `src/app/globals.css` (Tailwind import + CSS 변수)

## 주의사항

- `public/` 폴더의 이미지는 직접 올린 것이라 함부로 삭제하지 말 것
- `layout.tsx`의 `metadata` 제목/설명은 아직 기본값(`"Create Next App"`)이므로 기능 추가 시 함께 수정

## 코딩 스타일

- 컴포넌트 이름은 한국어 주석으로 설명
- 코드 설명은 항상 한국어로 작성
- 버튼 색상은 항상 브랜드 컬러인 파란색으로 통일
