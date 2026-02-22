export const CONSENT_VERSION = 1
export const CONSENT_STORAGE_KEY = 'chronosync-cookie-consent'

export type ConsentDecision = 'accepted' | 'rejected' | 'customized'

export type ConsentPreferences = {
  necessary: true
  preferences: boolean
  analytics: boolean
}

export type ConsentState = {
  version: number
  decision: ConsentDecision
  preferences: ConsentPreferences
  updatedAt: string
}

const CONSENT_CHANGED_EVENT = 'chronosync:consent-changed'

const isBrowser = typeof window !== 'undefined'

const parseConsent = (value: string): ConsentState | null => {
  try {
    const parsed = JSON.parse(value) as Partial<ConsentState>

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed.version !== CONSENT_VERSION ||
      !parsed.preferences ||
      typeof parsed.preferences.preferences !== 'boolean' ||
      typeof parsed.preferences.analytics !== 'boolean' ||
      typeof parsed.updatedAt !== 'string'
    ) {
      return null
    }

    const decision: ConsentDecision =
      parsed.decision === 'accepted' || parsed.decision === 'rejected' || parsed.decision === 'customized'
        ? parsed.decision
        : 'customized'

    return {
      version: CONSENT_VERSION,
      decision,
      preferences: {
        necessary: true,
        preferences: parsed.preferences.preferences,
        analytics: parsed.preferences.analytics,
      },
      updatedAt: parsed.updatedAt,
    }
  } catch {
    return null
  }
}

export const getStoredConsent = (): ConsentState | null => {
  if (!isBrowser) {
    return null
  }

  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  if (!value) {
    return null
  }

  return parseConsent(value)
}

export const hasUserMadeConsentChoice = (): boolean => getStoredConsent() !== null

export const hasConsentForPreferences = (): boolean => Boolean(getStoredConsent()?.preferences.preferences)

export const hasConsentForAnalytics = (): boolean => Boolean(getStoredConsent()?.preferences.analytics)

export const saveConsent = (
  preferenceState: Pick<ConsentPreferences, 'preferences' | 'analytics'>,
  decision: ConsentDecision,
): ConsentState => {
  const nextState: ConsentState = {
    version: CONSENT_VERSION,
    decision,
    preferences: {
      necessary: true,
      preferences: preferenceState.preferences,
      analytics: preferenceState.analytics,
    },
    updatedAt: new Date().toISOString(),
  }

  if (isBrowser) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(nextState))
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: nextState }))
  }

  return nextState
}

export const onConsentChanged = (callback: (state: ConsentState | null) => void): (() => void) => {
  if (!isBrowser) {
    return () => undefined
  }

  const handleConsentChange = () => {
    callback(getStoredConsent())
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) {
      handleConsentChange()
    }
  }

  window.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange)
    window.removeEventListener('storage', handleStorage)
  }
}