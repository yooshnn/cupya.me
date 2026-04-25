const PREFIX = 'online-judge:';

const KEYS = {
  theme: 'theme',
} as const;

type Key = keyof typeof KEYS;

export const persist = {
  get<T extends string>(key: Key): T | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(`${PREFIX}${KEYS[key]}`) as T | null;
  },
  set(key: Key, value: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(`${PREFIX}${KEYS[key]}`, value);
  },
};
