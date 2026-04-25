'use client';

import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { Link } from 'waku';
import { useTheme } from '../hooks/use-theme';

export function Header() {
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <header className="border-b border-line bg-elevated/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="text-base font-bold text-label">
          oj.cupya.me
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium text-label-a">
          <Link to="/problems" className="hover:text-label">
            Problems
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="테마 전환"
            aria-pressed={theme === 'dark'}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-label-a transition-colors hover:text-label"
          >
            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
        </nav>
      </div>
    </header>
  );
}
