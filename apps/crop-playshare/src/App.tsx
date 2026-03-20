import { useLang } from './hooks/useLang';
import { useTheme } from './hooks/useTheme';

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
    </div>
  );
}
