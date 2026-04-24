import { Link } from 'waku';

export default async function HomePage() {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-112px)] max-w-7xl items-center px-4 py-14 sm:px-6">
      <title>oj.cupya.me</title>
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase text-primary">
          Online Judge Archive
        </p>
        <h1 className="text-4xl font-bold tracking-normal text-label sm:text-5xl">
          직접 만든 문제를 읽고, 브라우저에서 C++ 코드를 채점합니다.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-label-n">
          로그인, 랭킹, 제출 서버 없이 문제 본문과 해설을 열람하고 샘플/전체 테스트를
          현재 브라우저 안에서 실행하는 작은 문제 아카이브입니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/problems"
            className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-pri-text hover:brightness-95"
          >
            문제 목록 보기
          </Link>
        </div>
      </div>
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
