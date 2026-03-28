import { useCallback, useEffect, useState } from 'react';
import { persist } from '../lib/persist';

type Theme = 'dark' | 'light';

function getInitialTheme(): Theme {
  const stored = persist.get<Theme>('theme');
  if (stored)
    return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    persist.set('theme', theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), []);

  return { theme, toggle } as const;
}
