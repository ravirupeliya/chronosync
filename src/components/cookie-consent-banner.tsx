import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { saveConsent, type ConsentState } from '@/lib/consent'

type CookieConsentBannerProps = {
  onConsentSaved: (state: ConsentState) => void
}

export function CookieConsentBanner({ onConsentSaved }: CookieConsentBannerProps) {
  const { t } = useTranslation()
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
  const [preferencesEnabled, setPreferencesEnabled] = useState(true)

  const handleAcceptAll = () => {
    const state = saveConsent({ preferences: true, analytics: true }, 'accepted')
    onConsentSaved(state)
  }

  const handleSavePreferences = () => {
    const state = saveConsent(
      {
        preferences: preferencesEnabled,
        analytics: true,
      },
      'customized',
    )
    onConsentSaved(state)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:px-6 lg:px-8">
        <div className="space-y-1">
          <h2 className="text-base font-semibold">{t('consent.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('consent.description')}</p>
        </div>

        {isCustomizeOpen && (
          <div className="grid gap-3 border-y py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label htmlFor="consent-necessary">{t('consent.necessaryTitle')}</Label>
                <p className="text-xs text-muted-foreground">{t('consent.necessaryDescription')}</p>
              </div>
              <Switch id="consent-necessary" checked disabled aria-readonly />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label htmlFor="consent-preferences">{t('consent.preferencesTitle')}</Label>
                <p className="text-xs text-muted-foreground">{t('consent.preferencesDescription')}</p>
              </div>
              <Switch
                id="consent-preferences"
                checked={preferencesEnabled}
                onCheckedChange={setPreferencesEnabled}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label htmlFor="consent-analytics">{t('consent.analyticsTitle')}</Label>
                <p className="text-xs text-muted-foreground">{t('consent.analyticsDescription')}</p>
              </div>
              <Switch id="consent-analytics" checked disabled aria-readonly />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {!isCustomizeOpen ? (
            <Button variant="outline" onClick={() => setIsCustomizeOpen(true)}>
              {t('consent.customize')}
            </Button>
          ) : (
            <Button onClick={handleSavePreferences} variant="secondary">
              {t('consent.savePreferences')}
            </Button>
          )}
          {!isCustomizeOpen && <Button onClick={handleAcceptAll}>{t('consent.acceptAll')}</Button>}
        </div>
      </div>
    </div>
  )
}