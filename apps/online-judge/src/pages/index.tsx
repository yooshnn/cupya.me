import { ArrowRightIcon, CodeIcon, GlobeIcon } from '@phosphor-icons/react/dist/ssr';
import { Link } from 'waku';
import { getProblemIndex } from '../lib/content';

export default async function HomePage() {
  const problemCount = getProblemIndex().length;

  return (
    <>
      <title>Cupya Online Judge</title>

      <section className="home-hero">
        <div className="home-hero__inner">
          <p className="home-eyebrow">Online Judge Archive</p>
          <h1 className="home-h1">
            <img src="/images/favicon.svg" alt="" aria-hidden="true" className="home-h1__mark" />
            OJ 아카이브
          </h1>
          <p className="home-desc">
            직접 출제한 알고리즘 문제와 해설을 정리하여 공개합니다.
            <br />
            브라우저에서 C++로 바로 풀어볼 수 있습니다.
          </p>
          <div className="home-cta-group">
            <Link to="/problems" className="home-cta">
              <span>문제 목록 보기</span>
              <span aria-hidden="true"><ArrowRightIcon size={18} /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="home-features__grid">
          <div className="home-feature">
            <span className="home-feature__num">
              <CodeIcon />
            </span>
            <h2>문제 아카이브</h2>
            <p>
              그동안 출제한 알고리즘 문제
              {' '}
              {problemCount}
              개를 솔루션과 함께 공개합니다.
            </p>
          </div>
          <div className="home-feature">
            <span className="home-feature__num">
              <GlobeIcon />
            </span>
            <h2>브라우저 채점</h2>
            <p>
              브라우저에서 C++ 코드를 작성하고 바로 채점해 볼 수 있습니다.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
