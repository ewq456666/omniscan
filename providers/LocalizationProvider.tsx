import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import i18next from '@/i18n/config';
import { detectSystemLanguage } from '@/i18n/config';
import { useMockDataStore } from '@/stores/useMockDataStore';

export function LocalizationProvider({ children }: PropsWithChildren) {
  const localePreference = useMockDataStore((state) => state.preferences.locale);
  const systemLanguage = useMemo(() => detectSystemLanguage(), []);
  const resolvedLanguage = localePreference === 'system' ? systemLanguage : localePreference;
  const [isReady, setIsReady] = useState(i18next.isInitialized);

  useEffect(() => {
    if (i18next.language !== resolvedLanguage) {
      void i18next.changeLanguage(resolvedLanguage);
    }
  }, [resolvedLanguage]);

  useEffect(() => {
    if (i18next.isInitialized) {
      setIsReady(true);
      return;
    }
    const handleInitialized = () => setIsReady(true);
    i18next.on('initialized', handleInitialized);
    return () => {
      i18next.off('initialized', handleInitialized);
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
