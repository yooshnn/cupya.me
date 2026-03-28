import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { persist } from '~/lib/persist';

export const LANGUAGES = {
  ko: '한국어',
  ja: '日本語',
} as const;

export type LangKey = keyof typeof LANGUAGES;

export function useLang() {
  const { t, i18n } = useTranslation();

  const setLang = useCallback((lang: LangKey) => {
    i18n.changeLanguage(lang);
    persist.set('lang', lang);
  }, [i18n]);

  return { lang: i18n.language as LangKey, setLang, t } as const;
}
