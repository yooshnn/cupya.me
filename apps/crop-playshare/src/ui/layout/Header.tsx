import type { LangKey } from '~/hooks/useLang';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { LANGUAGES, useLang } from '~/hooks/useLang';
import { useTheme } from '~/hooks/useTheme';
import { cn } from '~/lib/cn';

export function Header() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, setLang } = useLang();

  return (
    <header className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-line">
      <span className="font-mono font-bold text-sm text-label tracking-tight">
        <span className="text-primary">crop.</span>
        playshare
      </span>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="테마 전환"
          aria-pressed={theme === 'dark'}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-line text-label-a hover:text-label transition-colors"
        >
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* Language switches */}
        <div
          className="flex bg-surface rounded-lg p-1"
          role="group"
          aria-label="언어 선택"
        >
          {(Object.entries(LANGUAGES) as [LangKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setLang(key)}
              aria-pressed={lang === key}
              className={cn(
                'text-[10px] px-2.5 py-1 rounded-md transition-colors border border-transparent',
                lang === key
                  ? 'bg-primary/10 border-primary/50 text-primary'
                  : 'text-label-a hover:text-label',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
