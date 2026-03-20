const PREFIX = 'crop-playshare:';

const KEYS = {
  theme: 'theme',
  lang: 'lang',
} as const;

type Key = keyof typeof KEYS;

export const persist = {
  get<T extends string>(key: Key): T | null {
    return localStorage.getItem(`${PREFIX}${KEYS[key]}`) as T | null;
  },
  set(key: Key, value: string): void {
    localStorage.setItem(`${PREFIX}${KEYS[key]}`, value);
  },
};
