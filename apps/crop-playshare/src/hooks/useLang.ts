import { useTranslation } from 'react-i18next';
import { persist } from '~/lib/persist';

type Lang = 'ko' | 'ja';

export function useLang() {
  const { t, i18n } = useTranslation();

  const setLang = (lang: Lang) => {
    i18n.changeLanguage(lang);
    persist.set('lang', lang);
  };

  return { lang: i18n.language as Lang, setLang, t } as const;
}
