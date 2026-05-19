import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black px-6">
      <div className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
          자산관리 포트폴리오
        </h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          바이브코딩으로 만드는 나만의 자산관리 서비스입니다.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
        >
          지금 시작하기
        </Link>
      </div>
    </main>
  );
}
