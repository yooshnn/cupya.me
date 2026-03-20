import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { persist } from '../lib/persist';
import ja from './locales/ja';
import ko from './locales/ko';

const LOCALES: [string, ...string[]] = ['ja', 'ko'];

function getInitialLang(): string {
  const stored = persist.get('lang');
  if (stored && LOCALES.includes(stored)) {
    return stored;
  }

  const lang = navigator.language.slice(0, 2);
  return LOCALES.includes(lang) ? lang : LOCALES[0];
}

i18n.use(initReactI18next).init({
  resources: {
    ja: { translation: ja },
    ko: { translation: ko },
  },
  lng: getInitialLang(),
  fallbackLng: 'ja',
  interpolation: { escapeValue: false },
});

export default i18n;
