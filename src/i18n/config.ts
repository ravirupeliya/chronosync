import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Settings } from 'luxon'

import { hasConsentForPreferences } from '@/lib/consent'
import resources, {
  LANGUAGE_LOCALES,
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
} from '@/i18n/resources'

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en'
  }

  if (hasConsentForPreferences()) {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored) {
      return normalizeLanguage(stored)
    }
  }

  return normalizeLanguage(window.navigator.language)
}

const initialLanguage = getInitialLanguage()

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
})

const syncLocale = (language: string) => {
  const nextLanguage = normalizeLanguage(language)
  const locale = LANGUAGE_LOCALES[nextLanguage]

  Settings.defaultLocale = locale

  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale
  }

  if (typeof window !== 'undefined') {
    if (hasConsentForPreferences()) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    } else {
      window.localStorage.removeItem(LANGUAGE_STORAGE_KEY)
    }
  }
}

syncLocale(initialLanguage)
i18n.on('languageChanged', syncLocale)

export default i18n
