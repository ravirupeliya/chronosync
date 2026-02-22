type AnalyticsPrimitive = string | number | boolean

type AnalyticsParams = Record<string, AnalyticsPrimitive | null | undefined>

import { hasConsentForAnalytics } from '@/lib/consent'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

const isAnalyticsEnabled = () => isBrowser && Boolean(MEASUREMENT_ID) && hasConsentForAnalytics()

const initializeGtag = () => {
  if (!isAnalyticsEnabled() || !MEASUREMENT_ID) {
    return
  }

  if (!window.dataLayer) {
    window.dataLayer = []
  }

  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args)
    }
  }

  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  })
}

const loadGtagScript = () => {
  if (!isAnalyticsEnabled() || !MEASUREMENT_ID) {
    return
  }

  const scriptId = 'ga4-gtag-script'
  if (document.getElementById(scriptId)) {
    return
  }

  const script = document.createElement('script')
  script.id = scriptId
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
  document.head.appendChild(script)
}

const getGtag = () => {
  if (!isAnalyticsEnabled()) {
    return undefined
  }

  loadGtagScript()
  initializeGtag()
  return window.gtag
}

export const initializeAnalytics = () => {
  getGtag()
}

export const trackPageView = (path?: string) => {
  const gtag = getGtag()
  if (!gtag) {
    return
  }

  const pagePath = path ?? `${window.location.pathname}${window.location.search}`
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePath,
  })
}

export const trackEvent = (name: string, params: AnalyticsParams = {}) => {
  const gtag = getGtag()
  if (!gtag) {
    return
  }

  gtag('event', name, params)
}
