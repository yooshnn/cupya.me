import { useCallback, useEffect, useState } from 'react';
import { persist } from '../lib/persist';

type Theme = 'dark' | 'light';

function getBrowserTheme(): Theme {
  const stored = persist.get<Theme>('theme');
  if (stored) {
    return stored;
  }

  if (typeof window === 'undefined') {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getBrowserTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    persist.set('theme', theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme(current => (current === 'dark' ? 'light' : 'dark')), []);

  return { theme, toggle } as const;
}
