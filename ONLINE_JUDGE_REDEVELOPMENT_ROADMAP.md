# Online Judge Redevelopment Roadmap

이 문서는 `apps/online-judge`를 다시 개발한다고 가정했을 때 필요한 외부 리소스를 명확히 정의하고, 현재 동작을 재현한 뒤 개선 가능한 구조로 확장하기 위한 단계별 로드맵을 정리한다.

## 목표

- 문제 목록, 문제 본문, 해설을 정적 페이지로 제공한다.
- 브라우저 안에서 C++ 코드를 컴파일하고 샘플/전체 테스트를 실행한다.
- 서버 제출, 로그인, 랭킹 없이 동작한다.
- 초기 페이지 로드는 가볍게 유지하고, 브라우저 채점 리소스는 사용자가 채점 기능을 활성화할 때 불러온다.
- 스페셜 저지는 별도 단계에서 안정화한다.

## 외부 리소스 정의

### 1. 콘텐츠 빌드 산출물

콘텐츠는 `apps/online-judge/public/oj-content` 아래에 배치되는 정적 파일이다.

- `public/oj-content/problems.index.json`
  - 문제 목록 페이지와 `staticPaths` 생성을 위한 인덱스.
  - 각 항목은 최소 `id`, `title`을 가져야 한다.
- `public/oj-content/problems/*.json`
  - 문제 상세/해설 페이지에서 쓰는 문제 번들.
  - 문제 본문 Markdown, 해설 Markdown, 정답 코드, 샘플 테스트, 채점 설정, 전체 테스트 파일 경로, optional checker asset 정보를 포함한다.
- `public/oj-content/judge-cases/*.json`
  - 전체 채점 시 fetch로 불러오는 테스트케이스 배열.
  - 각 항목은 `id`, `stdin`, `expected`를 가진다.
- `public/oj-content/checkers/*.js`
  - 스페셜 저지용 custom checker 모듈.
  - default export는 `(input) => CheckerOutcome | Promise<CheckerOutcome>` 형태의 함수여야 한다.

앱은 외부 콘텐츠 프로젝트를 실행하지 않는다. `public/oj-content`가 이미 준비되어 있다고 가정하고, dev/build/typecheck에서는 `content:verify`로 이 디렉터리의 구조만 검증한다.

### 2. Wasm judge runtime 패키지

앱은 npm registry에 publish된 public package를 의존성으로 사용한다.

- `@cupya.me/wasm-judge-runtime-browser`
- `@cupya.me/wasm-judge-runtime-core`

`@cupya.me/wasm-judge-runtime-cpp`는 browser package의 transitive dependency로 따라오므로 앱이 직접 의존하지 않는다.

### 3. Wasm judge runtime artifact

브라우저 채점은 번들 JS만으로 끝나지 않고, 컴파일러/시스루트 artifact를 별도 URL에서 가져온다.

- sysroot URL env: `WAKU_PUBLIC_JUDGE_SYSROOT_URL`
- YoWASP Clang bundle URL env: `WAKU_PUBLIC_YOWASP_CLANG_BUNDLE_URL`
- first release sysroot URL: `https://static.cupya.me/sysroot.tar.gz`
- first release YoWASP bundle URL: `https://cdn.jsdelivr.net/npm/@yowasp/clang@22.0.0-git20542-10/gen/bundle.js`

앱 빌드 산출물에는 production artifact를 포함하지 않는다. `scripts/verify-build.mjs`는 `dist/public/judge-artifacts`가 있으면 실패하도록 되어 있다.

### 4. 배포 플랫폼

- Cloudflare Workers + Static Assets
- 설정 파일: `apps/online-judge/wrangler.jsonc`
- 정적 asset directory: `apps/online-judge/dist/public`
- Worker entry: `apps/online-judge/src/waku.server.tsx`
- 필요한 compatibility flags:
  - `nodejs_compat`
  - `nodejs_als`
- route:
  - `oj.cupya.me`

### 5. 프론트엔드 프레임워크와 빌드 도구

- Waku `1.0.0-alpha.7`
- React `~19.2.5`
- Vite via Waku config
- Tailwind CSS `4.2.2`
- Cloudflare Vite plugin
- React Compiler preset via `@vitejs/plugin-react` and `@rolldown/plugin-babel`

### 6. CSS와 폰트 리소스

- 앱 CSS: `apps/online-judge/src/styles.css`
- KaTeX CSS: `katex/dist/katex.min.css`
- KaTeX font files are emitted into `dist/public/assets/KaTeX_*`.
- External font CSS imports:
  - Pretendard from `cdn.jsdelivr.net`
  - Ubuntu Sans Mono from `fonts.googleapis.com`

현재는 root layout에서 KaTeX CSS를 전역 import하기 때문에 모든 페이지가 KaTeX CSS와 font-face 선언을 받는다.

### 7. 브라우저 API 요구사항

채점 기능은 다음 브라우저 기능을 전제로 한다.

- `Worker` with module worker support
- `WebAssembly`
- `fetch`
- `Blob`
- `crypto.randomUUID`
- transferable `ArrayBuffer`

채점 UI는 브라우저 전용이므로 `JudgePanel`은 client component로 유지해야 한다.

## 현재 리소스 로딩 모델

### `/`

- 정적 HTML로 렌더링된다.
- 공통 CSS를 로드한다.
- Waku client bootstrap JS를 로드한다.
- judge runtime은 로드하지 않는다.

### `/problems`

- 정적 HTML로 렌더링된다.
- `problems.index.json`에서 문제 목록을 만든다.
- 공통 CSS와 Waku client bootstrap JS를 로드한다.
- judge runtime은 로드하지 않는다.

### `/problems/[id]`

- 정적 HTML로 렌더링된다.
- 문제 본문과 샘플 테스트는 HTML에 포함된다.
- `JudgePanel` client chunk를 로드한다.
- 사용자가 에디터를 활성화하면 전체 테스트 JSON, optional checker, wasm judge runtime, worker, artifact를 로드한다.

### `/problems/[id]/editorial`

- 정적 HTML로 렌더링된다.
- 해설 Markdown과 정답 코드는 HTML에 포함된다.
- judge runtime은 로드하지 않는다.

## 재개발 로드맵

### Phase 0. 기준 동작과 리소스 계약 고정

- [ ] 현재 앱에서 반드시 유지할 사용자 플로우를 문서화한다.
  - [ ] 홈에서 문제 목록으로 이동한다.
  - [ ] 문제 목록에서 문제 상세로 이동한다.
  - [ ] 문제 상세에서 본문, 제한, 샘플을 확인한다.
  - [ ] 에디터를 활성화한다.
  - [ ] 샘플 채점을 실행한다.
  - [ ] 전체 채점을 실행한다.
  - [ ] 제출 결과 모달을 확인한다.
  - [ ] 해설 페이지로 이동한다.
- [ ] 콘텐츠 contract를 명시한다.
  - [ ] `problems.index.json` schema를 정의한다.
  - [ ] `problems/*.json` schema를 정의한다.
  - [ ] `judge-cases/*.json` schema를 정의한다.
  - [ ] `checkers/*.js` module contract를 정의한다.
- [ ] runtime artifact contract를 명시한다.
  - [ ] artifact base URL 계산 규칙을 정의한다.
  - [ ] localhost와 production URL 차이를 정의한다.
  - [ ] artifact URL에서 반드시 존재해야 하는 파일 목록을 정의한다.
- [ ] build output contract를 명시한다.
  - [ ] `dist/public/oj-content/problems.index.json`이 있어야 한다.
  - [ ] `dist/public/oj-content/problems`가 있어야 한다.
  - [ ] `dist/public/oj-content/judge-cases`가 있어야 한다.
  - [ ] `dist/public/judge-artifacts`는 production build에 없어야 한다.
- [ ] 검증 방법:
  - [ ] `pnpm --filter @cupya.me/online-judge typecheck`
  - [ ] `pnpm --filter @cupya.me/online-judge lint`
  - [ ] `pnpm --filter @cupya.me/online-judge build`
  - [ ] `node apps/online-judge/scripts/verify-build.mjs`
  - [ ] 브라우저에서 `/`, `/problems`, `/problems/a-plus-b`, `/problems/a-plus-b/editorial`을 열어 200 응답을 확인한다.

### Phase 1. 콘텐츠 파이프라인 재구성

- [ ] `apps/online-judge/public/oj-content`를 앱이 소비하는 유일한 콘텐츠 소스로 정한다.
- [ ] 앱 안에서는 외부 content repo를 빌드하거나 복사하지 않는다.
- [ ] `scripts/verify-content.mjs`의 책임을 고정한다.
  - [ ] 입력: `apps/online-judge/public/oj-content`.
  - [ ] 출력: 성공/실패 상태와 누락된 콘텐츠 경로.
- [ ] 콘텐츠 검증을 강화한다.
  - [ ] 문제 id와 파일 이름이 일치하는지 확인한다.
  - [ ] `problems.index.json`의 모든 id에 대응하는 `problems/*.json`이 있는지 확인한다.
  - [ ] 각 문제의 `judgeTests.path`가 실제 파일을 가리키는지 확인한다.
  - [ ] custom checker 문제는 `checkerAsset.path`가 실제 파일을 가리키는지 확인한다.
- [ ] 앱 내부의 runtime validation은 `src/lib/content-contract.ts`에 집중시킨다.
- [ ] 페이지 컴포넌트는 이미 normalize된 `ProblemBundle`만 받게 한다.
- [ ] 검증 방법:
  - [ ] `pnpm --filter @cupya.me/online-judge run content:verify`
  - [ ] `find apps/online-judge/public/oj-content -maxdepth 3 -type f | sort`
  - [ ] 잘못된 문제 id, 누락된 judge case, 누락된 checker를 가진 fixture를 넣고 validation이 실패하는지 확인한다.
  - [ ] `pnpm --filter @cupya.me/online-judge typecheck`

### Phase 2. 라우팅과 정적 생성 구조 재작성

- [ ] Waku fs router를 유지한다.
  - [ ] entry는 `src/waku.server.tsx`로 둔다.
  - [ ] `fsRouter(import.meta.glob('./**/*.{tsx,ts}', { base: './pages' }))` 구조를 유지한다.
- [ ] root layout을 최소 책임으로 재작성한다.
  - [ ] `<meta name="description">`를 유지한다.
  - [ ] favicon link를 유지한다.
  - [ ] Header/Footer를 layout에 둔다.
  - [ ] 전역 CSS import 위치를 명확히 한다.
- [ ] 홈 페이지를 정적 페이지로 만든다.
  - [ ] route: `/`
  - [ ] `getConfig().render = 'static'`
- [ ] 문제 목록 페이지를 정적 페이지로 만든다.
  - [ ] route: `/problems`
  - [ ] `getProblemIndex()`를 사용한다.
  - [ ] `getConfig().render = 'static'`
- [ ] 문제 상세 페이지를 정적 dynamic route로 만든다.
  - [ ] route: `/problems/[id]`
  - [ ] `getConfig().staticPaths = getProblemIds()`
  - [ ] unknown problem id는 build 단계에서 실패하게 한다.
- [ ] 해설 페이지를 정적 dynamic route로 만든다.
  - [ ] route: `/problems/[id]/editorial`
  - [ ] `getConfig().staticPaths = getProblemIds()`
- [ ] 검증 방법:
  - [ ] `pnpm --filter @cupya.me/online-judge exec waku build`
  - [ ] `find apps/online-judge/dist/public -path '*index.html' | sort`
  - [ ] `find apps/online-judge/dist/public/RSC -type f | sort`
  - [ ] 생성된 HTML에 홈, 문제 목록, 각 문제, 각 해설이 있는지 확인한다.

### Phase 3. Markdown 렌더링과 수식 리소스 분리

- [ ] `Markdown` 컴포넌트의 책임을 제한한다.
  - [ ] Markdown source를 HTML로 렌더링한다.
  - [ ] GFM을 지원한다.
  - [ ] inline/block math를 지원한다.
  - [ ] KaTeX HTML을 생성한다.
- [ ] KaTeX CSS 로딩 전략을 결정한다.
  - [ ] 단순 유지안: root layout에서 전역 import한다.
  - [ ] 최적화안: 문제/해설 route subtree에만 import한다.
  - [ ] 고급 최적화안: 콘텐츠 metadata에 `hasMath`를 추가하고 수식이 있는 페이지만 KaTeX CSS를 로드한다.
- [ ] KaTeX font 비용을 측정한다.
  - [ ] `dist/public/assets/KaTeX_*` 전체 용량을 기록한다.
  - [ ] 실제 페이지에서 어떤 font file이 요청되는지 브라우저 Network 탭에서 확인한다.
- [ ] 외부 font import 정책을 정한다.
  - [ ] Pretendard를 외부 CDN으로 둘지 self-host할지 결정한다.
  - [ ] mono font를 Google Fonts로 둘지 system monospace로 대체할지 결정한다.
- [ ] 검증 방법:
  - [ ] `pnpm --filter @cupya.me/online-judge build`
  - [ ] `du -ch apps/online-judge/dist/public/assets/KaTeX_* | tail -1`
  - [ ] `rg '@import|KaTeX|fonts.googleapis|cdn.jsdelivr' apps/online-judge/dist/public/assets/*.css`
  - [ ] 수식이 포함된 문제/해설에서 수식 렌더링이 깨지지 않는지 스크린샷으로 확인한다.
  - [ ] 수식이 없는 홈/목록 페이지의 CSS/font 요청이 목표와 맞는지 Network 탭으로 확인한다.

### Phase 4. JudgePanel 클라이언트 경계 재작성

- [ ] `JudgePanel`을 유일한 채점 UI client component로 유지한다.
- [ ] `JudgePanel` props는 직렬화 가능한 `ProblemBundle`로 제한한다.
- [ ] 초기 렌더 상태를 정의한다.
  - [ ] `enabled = false`
  - [ ] `runtimeState = 'idle'`
  - [ ] source code는 `problem.template`
  - [ ] submissions는 빈 배열
  - [ ] selected submission은 null
- [ ] 에디터 활성화 플로우를 정의한다.
  - [ ] 버튼 클릭 시 editor를 보인다.
  - [ ] runtime state를 `bootstrapping`으로 바꾼다.
  - [ ] 전체 테스트 fetch promise를 캐시한다.
  - [ ] custom checker를 먼저 등록한다.
  - [ ] runtime과 테스트 데이터를 병렬로 준비한다.
  - [ ] 성공 시 `ready`, 실패 시 `error`로 전환한다.
- [ ] 채점 실행 플로우를 정의한다.
  - [ ] source size limit을 검사한다.
  - [ ] custom checker 등록을 보장한다.
  - [ ] runtime 준비를 보장한다.
  - [ ] sample mode는 `problem.sampleTests`를 사용한다.
  - [ ] full mode는 fetched judge cases를 사용한다.
  - [ ] 결과를 submission history 맨 앞에 추가한다.
  - [ ] 결과 모달을 연다.
- [ ] 검증 방법:
  - [ ] React Testing Library 또는 Playwright component/e2e 테스트로 버튼 상태 전이를 확인한다.
  - [ ] source limit 초과 시 에러 메시지가 표시되는지 확인한다.
  - [ ] sample judge 성공 케이스가 Accepted로 표시되는지 확인한다.
  - [ ] 틀린 코드가 Wrong Answer로 표시되는지 확인한다.
  - [ ] compile error 코드가 Compile Error로 표시되는지 확인한다.

### Phase 5. Runtime loading과 artifact loading 재작성

- [ ] `src/lib/judge-client.ts`를 브라우저 채점의 유일한 gateway로 둔다.
- [ ] `ensureRuntime()`은 runtime singleton promise를 반환하게 한다.
- [ ] runtime package는 dynamic import로만 로드한다.
  - [ ] 초기 페이지 HTML에서 runtime package chunk가 preload되지 않아야 한다.
  - [ ] `JudgePanel` chunk에는 runtime dynamic import stub만 포함되어야 한다.
- [ ] artifact URL 주입을 명확히 한다.
  - [ ] `WAKU_PUBLIC_JUDGE_SYSROOT_URL`을 runtime의 `sysrootUrl`로 넘긴다.
  - [ ] `WAKU_PUBLIC_YOWASP_CLANG_BUNDLE_URL`을 runtime의 `yowaspClangBundleUrl`로 넘긴다.
  - [ ] env가 없으면 채점 활성화 시 명확한 에러를 낸다.
- [ ] runtime 생성 옵션을 명확히 한다.
  - [ ] `sysrootUrl`
  - [ ] `yowaspClangBundleUrl`
  - [ ] `checkers`
  - [ ] `version`
- [ ] worker 생성 결과를 확인한다.
  - [ ] runtime worker chunk가 별도 asset으로 생성되는지 확인한다.
  - [ ] execution worker chunk가 별도 asset으로 생성되는지 확인한다.
- [ ] 검증 방법:
  - [ ] `pnpm --filter @cupya.me/online-judge build`
  - [ ] `wc -c apps/online-judge/dist/public/assets/*.js | sort -n`
  - [ ] 홈/목록/해설 HTML에 runtime package chunk가 preload되지 않는지 `rg 'dist-.*js|runtimeWorker|executionWorker' apps/online-judge/dist/public/**/*.html`로 확인한다.
  - [ ] 문제 상세에서 에디터 활성화 전 Network 탭에 artifact 요청이 없는지 확인한다.
  - [ ] 에디터 활성화 후 artifact URL로 `sysroot.tar.gz`와 compiler bundle 요청이 발생하는지 확인한다.

### Phase 6. 테스트케이스 fetch와 캐싱 재작성

- [ ] `fetchJudgeCases(problem)` 책임을 제한한다.
  - [ ] `/oj-content/${problem.judgeTests.path}`를 fetch한다.
  - [ ] HTTP error를 명확한 메시지로 변환한다.
  - [ ] 응답이 배열인지 확인한다.
  - [ ] 각 testcase를 normalize한다.
- [ ] `JudgePanel`에서 full test promise를 캐시한다.
  - [ ] 에디터 활성화 시 한 번 생성한다.
  - [ ] 전체 채점 시 기존 promise를 재사용한다.
  - [ ] 실패한 promise 재시도 정책을 정한다.
- [ ] 테스트케이스 크기 정책을 정한다.
  - [ ] JSON 파일당 권장 최대 크기를 정한다.
  - [ ] 너무 큰 파일은 압축/분할할지 결정한다.
  - [ ] 전체 채점 시작 전 예상 다운로드 상태를 UI에 표시할지 결정한다.
- [ ] 검증 방법:
  - [ ] mock fetch로 정상 JSON, 404, invalid JSON, non-array JSON을 테스트한다.
  - [ ] 브라우저 Network 탭에서 full test JSON이 한 번만 요청되는지 확인한다.
  - [ ] 샘플 채점만 실행했을 때 full test JSON 요청이 발생하지 않는 정책을 선택했다면 그 상태를 확인한다.
  - [ ] 현재 정책처럼 활성화 시 full test JSON을 미리 가져온다면 활성화 시점에 한 번만 요청되는지 확인한다.

### Phase 7. Exact checker와 Special Judge 재작성

- [ ] exact checker 동작을 contract로 고정한다.
  - [ ] stdout과 expected를 정확히 비교한다.
  - [ ] `ignoreTrailingWhitespace` 옵션이 있으면 trailing whitespace를 무시한다.
- [ ] custom checker loading contract를 고정한다.
  - [ ] 문제 bundle의 `checker.kind`가 `custom`일 때만 checker asset을 로드한다.
  - [ ] checker asset이 없으면 명확히 실패한다.
  - [ ] default export가 함수가 아니면 명확히 실패한다.
  - [ ] checker id별 registry 중복 등록을 방지한다.
- [ ] custom checker module format을 명확히 한다.
  - [ ] ESM default export만 허용할지 결정한다.
  - [ ] relative import 금지 여부를 결정한다.
  - [ ] checker가 사용할 수 있는 input/output 타입을 문서화한다.
- [ ] checker sandbox 경계를 정한다.
  - [ ] checker는 브라우저 main thread에서 실행되는지 worker에서 실행되는지 결정한다.
  - [ ] main thread에서 실행한다면 checker 코드 신뢰 모델을 문서화한다.
  - [ ] untrusted checker를 지원하려면 별도 worker 격리를 설계한다.
- [ ] 검증 방법:
  - [ ] exact checker 문제에서 accepted/wrong answer를 테스트한다.
  - [ ] custom checker 문제에서 accepted/wrong answer를 테스트한다.
  - [ ] missing checker asset fixture가 예상 에러를 내는지 테스트한다.
  - [ ] default export가 함수가 아닌 checker fixture가 예상 에러를 내는지 테스트한다.
  - [ ] 같은 checker 문제를 두 번 채점해 checker module fetch/register가 중복되지 않는지 확인한다.

### Phase 8. 결과 모델과 UI 재작성

- [ ] runtime result를 UI result로 변환하는 함수를 분리한다.
  - [ ] `resultStatus`
  - [ ] `statusLabel`
  - [ ] `statusClass`
  - [ ] `resultPassed`
  - [ ] `resultElapsed`
- [ ] result modal 책임을 제한한다.
  - [ ] compile result 표시
  - [ ] finished result summary 표시
  - [ ] testcase별 stdout/stderr/message 표시
  - [ ] 닫기 동작
- [ ] submission history 책임을 제한한다.
  - [ ] submitted time 표시
  - [ ] sample/full mode 표시
  - [ ] status 표시
  - [ ] passed count 표시
  - [ ] 클릭 시 modal 열기
- [ ] 접근성 기본값을 확인한다.
  - [ ] modal role은 `dialog`.
  - [ ] modal backdrop click close를 지원한다.
  - [ ] close button에 aria-label을 둔다.
  - [ ] keyboard close를 지원할지 결정한다.
- [ ] 검증 방법:
  - [ ] compile error result fixture로 modal 렌더링 테스트.
  - [ ] accepted result fixture로 modal 렌더링 테스트.
  - [ ] mixed failed tests fixture로 modal 렌더링 테스트.
  - [ ] submission item click이 modal을 여는지 테스트.
  - [ ] close button과 backdrop click이 modal을 닫는지 테스트.

### Phase 9. 배포와 캐싱 정책 재작성

- [ ] Cloudflare static assets 구조를 유지한다.
  - [ ] `assets.directory = './dist/public'`
  - [ ] `html_handling = 'drop-trailing-slash'`
- [ ] `_headers` 정책을 정리한다.
  - [ ] `/RSC/*`는 `X-Robots-Tag: noindex` 유지.
  - [ ] hashed assets에 장기 cache header를 추가할지 결정한다.
  - [ ] `oj-content` cache 정책을 결정한다.
  - [ ] `judge-cases` cache 정책을 결정한다.
- [ ] artifact hosting 정책을 정리한다.
  - [ ] artifact URL version segment를 날짜 또는 runtime version으로 관리한다.
  - [ ] runtime package version과 artifact version이 맞지 않을 때 실패하도록 검증한다.
  - [ ] CORS와 MIME type을 확인한다.
- [ ] source map upload 정책을 정리한다.
  - [ ] `upload_source_maps: true` 유지 여부를 결정한다.
- [ ] 검증 방법:
  - [ ] `pnpm --filter @cupya.me/online-judge build`
  - [ ] `pnpm --filter @cupya.me/online-judge start`
  - [ ] Cloudflare local preview에서 HTML, asset, RSC, oj-content가 200으로 응답하는지 확인한다.
  - [ ] production 또는 staging에서 artifact URL에 직접 접근해 200과 올바른 MIME/cache header를 확인한다.

### Phase 10. 리소스 예산과 회귀 측정

- [ ] route별 초기 요청 예산을 정한다.
  - [ ] `/`: HTML + CSS + Waku bootstrap만 허용.
  - [ ] `/problems`: HTML + CSS + Waku bootstrap만 허용.
  - [ ] `/problems/[id]`: 위 항목 + JudgePanel client chunk만 허용.
  - [ ] `/problems/[id]/editorial`: HTML + CSS + Waku bootstrap만 허용.
- [ ] judge 활성화 이후 요청 예산을 정한다.
  - [ ] runtime dynamic chunk
  - [ ] runtime worker chunk
  - [ ] execution worker chunk
  - [ ] full test JSON
  - [ ] optional checker JS
  - [ ] compiler/sysroot artifact
- [ ] build output size snapshot을 만든다.
  - [ ] JS asset 크기.
  - [ ] CSS asset 크기.
  - [ ] KaTeX font 크기.
  - [ ] `oj-content` 크기.
  - [ ] RSC payload 크기.
- [ ] Lighthouse 또는 Playwright 기반 리소스 테스트를 추가할지 결정한다.
- [ ] 검증 방법:
  - [ ] `wc -c apps/online-judge/dist/public/assets/*.js apps/online-judge/dist/public/assets/*.css | sort -n`
  - [ ] `du -sh apps/online-judge/dist/public/oj-content`
  - [ ] `wc -c apps/online-judge/dist/public/RSC/R/**/*.txt`
  - [ ] Playwright route interception으로 초기 페이지 로드에서 artifact URL 요청이 없음을 assert한다.
  - [ ] Playwright route interception으로 에디터 활성화 후 artifact URL 요청이 있음을 assert한다.

### Phase 11. 로컬 개발 환경 재정리

- [ ] 필요한 환경 변수를 README 또는 이 문서에 고정한다.
  - [ ] `WAKU_PUBLIC_JUDGE_SYSROOT_URL`
  - [ ] `WAKU_PUBLIC_YOWASP_CLANG_BUNDLE_URL`
- [ ] 콘텐츠 준비 흐름을 정리한다.
  - [ ] 앱은 `public/oj-content`가 이미 존재한다고 가정한다.
  - [ ] 콘텐츠를 갱신하는 방법은 앱 외부 작업으로 문서화한다.
  - [ ] 앱 내부에서는 `content:verify`만 실행한다.
- [ ] artifact 연결 흐름을 정리한다.
  - [ ] 앱은 artifact를 repo 내부에 복사하거나 symlink하지 않는다.
  - [ ] 로컬/배포 모두 env로 URL을 주입한다.
- [ ] runtime 패키지 갱신 흐름을 정리한다.
  - [ ] runtime repo에서 새 npm version을 publish한다.
  - [ ] 앱은 semver dependency와 lockfile만 갱신한다.
- [ ] dev server 흐름을 정리한다.
  - [ ] `pnpm --filter @cupya.me/online-judge dev`
  - [ ] dev 전에 `content:verify`가 실행되는지 확인한다.
- [ ] 검증 방법:
  - [ ] fresh clone 기준으로 환경 변수만 설정하고 dev server를 띄운다.
  - [ ] localhost에서 에디터 활성화 시 env로 주입한 artifact URL 요청이 발생하는지 확인한다.
  - [ ] `pnpm --filter @cupya.me/online-judge build` 후 `dist/public/judge-artifacts`가 없는지 확인한다.

### Phase 12. 테스트 스위트 구성

- [ ] 단위 테스트 대상을 정한다.
  - [ ] content normalization.
  - [ ] judge case normalization.
  - [ ] artifact base URL calculation.
  - [ ] result formatting.
  - [ ] checker registry behavior.
- [ ] 컴포넌트 테스트 대상을 정한다.
  - [ ] `JudgePanel` state transition.
  - [ ] `ResultModal` rendering.
  - [ ] `SubmissionList` interactions.
- [ ] E2E 테스트 대상을 정한다.
  - [ ] route navigation.
  - [ ] static HTML rendering.
  - [ ] sample judge accepted.
  - [ ] sample judge wrong answer.
  - [ ] full judge accepted.
  - [ ] custom checker accepted/wrong answer.
- [ ] 네트워크 회귀 테스트를 정한다.
  - [ ] 초기 로드에서 artifact가 요청되지 않는다.
  - [ ] 문제 상세에서만 JudgePanel chunk가 필요하다.
  - [ ] full tests JSON은 필요한 시점에만 요청된다.
- [ ] CI 명령을 정한다.
  - [ ] `pnpm --filter @cupya.me/online-judge typecheck`
  - [ ] `pnpm --filter @cupya.me/online-judge lint`
  - [ ] `pnpm --filter @cupya.me/online-judge test`
  - [ ] `pnpm --filter @cupya.me/online-judge build`
- [ ] 검증 방법:
  - [ ] 테스트가 없는 상태에서는 CI가 실패하도록 설정한다.
  - [ ] mock runtime으로 빠른 component/e2e 테스트를 먼저 통과시킨다.
  - [ ] 실제 wasm runtime을 쓰는 browser test는 별도 slow suite로 분리한다.
  - [ ] CI에서 slow suite 실행 조건을 명확히 한다.

### Phase 13. 스페셜 저지 안정화

- [ ] 스페셜 저지 실패 원인을 분류한다.
  - [ ] checker module path 문제.
  - [ ] checker export format 문제.
  - [ ] checker input contract 불일치.
  - [ ] checker result contract 불일치.
  - [ ] runtime registry 등록 순서 문제.
  - [ ] CORS/MIME 문제.
- [ ] 최소 custom checker fixture를 만든다.
  - [ ] 항상 accepted를 반환하는 checker.
  - [ ] 항상 wrong_answer를 반환하는 checker.
  - [ ] stdout을 parsing해서 판정하는 checker.
  - [ ] 예외를 던지는 checker.
- [ ] custom checker 보안 모델을 결정한다.
  - [ ] trusted content only로 둘지 결정한다.
  - [ ] untrusted checker도 허용하려면 worker isolation을 설계한다.
- [ ] checker 에러 표시 정책을 정한다.
  - [ ] 사용자에게 보일 메시지.
  - [ ] 개발자 디버깅용 console log.
  - [ ] result status 매핑.
- [ ] 검증 방법:
  - [ ] 네 가지 custom checker fixture를 모두 실행한다.
  - [ ] accepted/wrong/internal_error가 올바르게 UI에 표시되는지 확인한다.
  - [ ] checker module이 404일 때 명확한 에러가 표시되는지 확인한다.
  - [ ] checker가 throw할 때 `internal_error`로 변환되는지 확인한다.

### Phase 14. 문서와 운영 체크리스트

- [ ] 개발자 문서를 작성한다.
  - [ ] content repo 준비 방법.
  - [ ] runtime repo 준비 방법.
  - [ ] local artifact link 방법.
  - [ ] dev/build/deploy 명령.
  - [ ] common failure와 해결 방법.
- [ ] 운영 문서를 작성한다.
  - [ ] 새 문제 추가 절차.
  - [ ] runtime artifact 갱신 절차.
  - [ ] Cloudflare deploy 절차.
  - [ ] rollback 절차.
- [ ] 릴리스 체크리스트를 작성한다.
  - [ ] content sync 완료.
  - [ ] typecheck/lint/build 완료.
  - [ ] resource budget 확인.
  - [ ] sample/full judge smoke test 완료.
  - [ ] special judge smoke test 완료.
- [ ] 검증 방법:
  - [ ] 문서만 보고 fresh environment에서 dev server를 띄울 수 있는지 확인한다.
  - [ ] 문서만 보고 production build를 만들 수 있는지 확인한다.
  - [ ] 문서만 보고 runtime artifact version을 올릴 수 있는지 확인한다.

## 권장 구현 순서

- [ ] Phase 0에서 계약을 고정한다.
- [ ] Phase 1, Phase 2로 정적 페이지와 콘텐츠 파이프라인을 먼저 완성한다.
- [ ] Phase 4, Phase 5, Phase 6으로 exact judge 기반 브라우저 채점을 복구한다.
- [ ] Phase 8로 결과 UI를 안정화한다.
- [ ] Phase 10, Phase 12로 리소스/테스트 회귀를 자동화한다.
- [ ] Phase 7, Phase 13으로 스페셜 저지를 별도 안정화한다.
- [ ] Phase 9, Phase 11, Phase 14로 배포와 운영 흐름을 닫는다.

## 완료 기준

- [ ] `pnpm --filter @cupya.me/online-judge typecheck`가 통과한다.
- [ ] `pnpm --filter @cupya.me/online-judge lint`가 통과한다.
- [ ] `pnpm --filter @cupya.me/online-judge build`가 통과한다.
- [ ] `node apps/online-judge/scripts/verify-build.mjs`가 통과한다.
- [ ] `/`, `/problems`, `/problems/[id]`, `/problems/[id]/editorial`이 정적 HTML로 생성된다.
- [ ] 홈/목록/해설 초기 로드에서 judge artifact 요청이 없다.
- [ ] 문제 상세 초기 로드에서 judge artifact 요청이 없다.
- [ ] 에디터 활성화 후 runtime chunk, worker chunk, test JSON, artifact 요청이 발생한다.
- [ ] 샘플 채점 accepted/wrong/compile error가 UI에 표시된다.
- [ ] 전체 채점 accepted/wrong/compile error가 UI에 표시된다.
- [ ] custom checker 문제의 accepted/wrong/internal error가 UI에 표시된다.
- [ ] production build에 `dist/public/judge-artifacts`가 포함되지 않는다.
