'use client';

import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { Link } from 'waku';
import { useTheme } from '../hooks/use-theme';

export function Header() {
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-elevated/90 backdrop-blur-sm">
      <div className="mx-auto flex w-[min(100%,960px)] items-center justify-between px-4 py-3">
        <Link to="/" className="font-mono text-sm font-bold text-label">
          oj.cupya.me
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-label-a">
          <Link to="/problems" className="transition-colors hover:text-label">
            문제 목록
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="테마 전환"
            aria-pressed={theme === 'dark'}
            className="flex h-7 w-7 cursor-pointer items-center justify-center text-label-a transition-colors hover:text-label"
          >
            <MoonIcon size={16} className="theme-icon-dark" />
            <SunIcon size={16} className="theme-icon-light" />
          </button>
        </nav>
      </div>
    </header>
  );
}
