import { useLang } from './hooks/useLang';
import { useTheme } from './hooks/useTheme';
import { Button } from './ui/common/Button';

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();

  return (
    <div className="w-full max-w-sm mx-auto bg-bg min-h-svh flex flex-col p-4 gap-2">
      <span className="font-mono font-bold text-[15px] text-label">
        crop
        <span className="text-primary">.</span>
        playshare
      </span>
      <div className="flex gap-2 text-sm">
        <button
          onClick={toggleTheme}
          className="border border-line px-3 py-1 rounded-lg text-label-n"
        >
          {theme}
        </button>
        <button
          onClick={() => setLang(lang === 'ko' ? 'ja' : 'ko')}
          className="border border-line px-3 py-1 rounded-lg text-label-n"
        >
          {lang}
        </button>
      </div>
      <p>{t('actions.share')}</p>
      <div className="bg-gradient-to-t from-bg via-bg/95 to-transparent pt-6 pb-7 px-4 space-y-2">
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            공유하기
          </Button>
          <Button variant="primary" className="flex-[1.6]">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            모두 다운로드
          </Button>
        </div>
      </div>
    </div>
  );
}
