import { getLocales } from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import zhTW from '@/locales/zh-TW.json';

export const resources = {
  en: { translation: en },
  'zh-TW': { translation: zhTW },
};

export const supportedLanguages = ['en', 'zh-TW'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const toSupportedLanguage = (tag?: string): SupportedLanguage => {
  if (!tag) {
    return 'en';
  }
  const normalized = tag.toLowerCase();
  if (normalized.startsWith('zh')) {
    return 'zh-TW';
  }
  return 'en';
};

export const detectSystemLanguage = (): SupportedLanguage => {
  const locales = getLocales?.();
  if (Array.isArray(locales) && locales.length > 0) {
    return toSupportedLanguage(locales[0].languageTag);
  }
  return 'en';
};

const defaultLanguage = detectSystemLanguage();

void i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    defaultNS: 'translation',
    fallbackNS: 'translation',
    ns: ['translation'],
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
    react: { useSuspense: false },
    initImmediate: false,
  });

export default i18next;
