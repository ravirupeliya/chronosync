import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import logoDarkUrl from '@/assets/chronosync-logo-dark.svg';
import githubIconUrl from '@/assets/github.svg';
import logoLightUrl from '@/assets/chronosync-logo.svg';

import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import { LanguageSelect } from '@/components/language-select';
import { PrimaryClockPanel } from '@/components/primary-clock-panel';
import { SecondaryClocksPanel } from '@/components/secondary-clocks-panel';
import { Button } from '@/components/ui/button';
import {
  initializeAnalytics,
  trackEvent,
  trackPageView,
} from '@/lib/analytics';
import {
  getStoredConsent,
  hasConsentForPreferences,
  onConsentChanged,
  type ConsentState,
} from '@/lib/consent';
import {
  buildTimeZoneOptions,
  buildUtcFromLocalParts,
  localPartsFromUtc,
  type BuildDateTimeResult,
} from '@/lib/time-utils';

const DEFAULT_PRIMARY_ZONE = 'Pacific/Auckland';
const THEME_STORAGE_KEY = 'chronosync-theme';
const SECONDARY_CLOCKS_STORAGE_KEY = 'chronosync-secondary-clocks';
const DEFAULT_SECONDARY_TIME_ZONES = [
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
];

type Theme = 'light' | 'dark';
type WarningState = BuildDateTimeResult['warning'];

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  if (hasConsentForPreferences()) {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const getInitialSecondaryTimeZones = (): string[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_SECONDARY_TIME_ZONES;
  }

  if (!hasConsentForPreferences()) {
    return DEFAULT_SECONDARY_TIME_ZONES;
  }

  const saved = window.localStorage.getItem(SECONDARY_CLOCKS_STORAGE_KEY);
  if (!saved) {
    return DEFAULT_SECONDARY_TIME_ZONES;
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return DEFAULT_SECONDARY_TIME_ZONES;
    }

    const uniqueZones = new Set<string>();
    for (const zone of parsed) {
      if (typeof zone === 'string' && zone.trim().length > 0) {
        uniqueZones.add(zone);
      }
    }

    return Array.from(uniqueZones);
  } catch {
    return DEFAULT_SECONDARY_TIME_ZONES;
  }
};

function App() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [consentState, setConsentState] = useState<ConsentState | null>(
    getStoredConsent,
  );
  const [primaryTimeZone, setPrimaryTimeZone] = useState(DEFAULT_PRIMARY_ZONE);
  const [primaryDateTimeUtc, setPrimaryDateTimeUtc] = useState(() =>
    DateTime.now().toUTC().startOf('minute'),
  );
  const [secondaryTimeZones, setSecondaryTimeZones] = useState<string[]>(
    getInitialSecondaryTimeZones,
  );
  const [warning, setWarning] = useState<WarningState>(undefined);

  const hasConsentChoice = consentState !== null;
  const preferencesConsentGranted = Boolean(
    consentState?.preferences.preferences ?? true,
  );
  const analyticsConsentGranted = Boolean(
    consentState?.preferences.analytics ?? true,
  );

  const timeZoneReferenceYear = primaryDateTimeUtc.year;
  const timeZoneReferenceMonth = primaryDateTimeUtc.month;
  const timeZoneReferenceDay = primaryDateTimeUtc.day;
  const timeZoneReferenceHour = primaryDateTimeUtc.hour;
  const timeZoneReferenceMinute = primaryDateTimeUtc.minute;

  const timeZoneOptions = useMemo(
    () =>
      buildTimeZoneOptions(
        DateTime.fromObject(
          {
            year: timeZoneReferenceYear,
            month: timeZoneReferenceMonth,
            day: timeZoneReferenceDay,
            hour: timeZoneReferenceHour,
            minute: timeZoneReferenceMinute,
            second: 0,
            millisecond: 0,
          },
          { zone: 'utc' },
        ),
      ),
    [
      timeZoneReferenceYear,
      timeZoneReferenceMonth,
      timeZoneReferenceDay,
      timeZoneReferenceHour,
      timeZoneReferenceMinute,
    ],
  );
  const applyLocalParts = (parts: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  }) => {
    const result = buildUtcFromLocalParts(parts, primaryTimeZone);
    setPrimaryDateTimeUtc(result.dateTimeUtc);
    setWarning(result.warning);
  };

  const handlePrimaryZoneChange = (zone: string) => {
    if (!zone) {
      return;
    }

    setPrimaryTimeZone(zone);
    setSecondaryTimeZones((previous) =>
      previous.filter((item) => item !== zone),
    );
    setWarning(undefined);
    trackEvent('timezone_selected', {
      zone,
      selection_type: 'primary',
    });
  };

  const handlePrimaryDateChange = (date: Date) => {
    const local = localPartsFromUtc(primaryDateTimeUtc, primaryTimeZone);
    applyLocalParts({
      ...local,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
  };

  const handlePrimaryClockTimeChange = (hour24: number, minute: number) => {
    const currentLocal = primaryDateTimeUtc.setZone(primaryTimeZone);
    const currentTotalMinutes = currentLocal.hour * 60 + currentLocal.minute;
    const nextTotalMinutes = hour24 * 60 + minute;
    const minuteDelta = nextTotalMinutes - currentTotalMinutes;

    let dayDelta = 0;
    if (minuteDelta <= -12 * 60) {
      dayDelta = 1;
    } else if (minuteDelta >= 12 * 60) {
      dayDelta = -1;
    }

    const adjustedDate = currentLocal.plus({ days: dayDelta });

    applyLocalParts({
      year: adjustedDate.year,
      month: adjustedDate.month,
      day: adjustedDate.day,
      hour: hour24,
      minute,
    });
  };

  const handleAmPmChange = (value: 'AM' | 'PM') => {
    const local = localPartsFromUtc(primaryDateTimeUtc, primaryTimeZone);
    const isPm = local.hour >= 12;
    const toggledHour =
      value === 'PM'
        ? isPm
          ? local.hour
          : local.hour + 12
        : isPm
          ? local.hour - 12
          : local.hour;

    applyLocalParts({
      ...local,
      hour: toggledHour,
    });
  };

  const handleAddSecondaryClock = (zone: string) => {
    if (!zone || zone === primaryTimeZone) {
      return;
    }

    setSecondaryTimeZones((previous) => {
      if (previous.includes(zone)) {
        return previous;
      }

      trackEvent('secondary_clock_added', {
        zone,
        secondary_count: previous.length + 1,
      });
      return [...previous, zone];
    });
  };

  const handleRemoveSecondaryClock = (zone: string) => {
    setSecondaryTimeZones((previous) =>
      previous.filter((item) => item !== zone),
    );
    trackEvent('secondary_clock_removed', {
      zone,
    });
  };

  const handleClearAllSecondaryClocks = () => {
    if (secondaryTimeZones.length > 0) {
      trackEvent('secondary_clocks_cleared', {
        cleared_count: secondaryTimeZones.length,
      });
    }
    setSecondaryTimeZones([]);
  };

  const handleReorderSecondaryClocks = (zones: string[]) => {
    if (zones.join('|') !== secondaryTimeZones.join('|')) {
      trackEvent('secondary_clocks_reordered', {
        secondary_count: zones.length,
      });
    }
    setSecondaryTimeZones(zones);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');

    if (preferencesConsentGranted) {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      return;
    }

    window.localStorage.removeItem(THEME_STORAGE_KEY);
  }, [preferencesConsentGranted, theme]);

  useEffect(() => {
    if (preferencesConsentGranted) {
      window.localStorage.setItem(
        SECONDARY_CLOCKS_STORAGE_KEY,
        JSON.stringify(secondaryTimeZones),
      );
      return;
    }

    window.localStorage.removeItem(SECONDARY_CLOCKS_STORAGE_KEY);
  }, [preferencesConsentGranted, secondaryTimeZones]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPrimaryDateTimeUtc((previous) => previous.plus({ seconds: 1 }));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!analyticsConsentGranted) {
      return;
    }

    initializeAnalytics();
    trackPageView();
  }, [analyticsConsentGranted]);

  useEffect(() => onConsentChanged(setConsentState), []);

  useEffect(() => {
    if (!warning) {
      return;
    }

    trackEvent('dst_warning_shown', {
      warning_type:
        warning.type === 'ambiguous' ? 'ambiguous' : 'invalid_or_adjusted',
    });
  }, [warning]);

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      trackEvent('theme_toggled', {
        selected_theme: nextTheme,
      });
      return nextTheme;
    });
  };

  const logoUrl = theme === 'dark' ? logoDarkUrl : logoLightUrl;

  return (
    <main className="min-h-screen bg-background">
      <div
        className={`mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3 lg:px-8 lg:pt-4 ${hasConsentChoice ? 'lg:pb-8' : 'pb-44 lg:pb-44'}`}
      >
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt={t('app.logoAlt')}
              className="size-10 rounded-md"
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">ChronoSync</h1>
              <p className="text-sm text-muted-foreground">
                {t('app.tagline')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelect />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label={t('app.switchTheme', {
                mode: t(theme === 'dark' ? 'app.light' : 'app.dark'),
              })}
              title={t('app.switchTheme', {
                mode: t(theme === 'dark' ? 'app.light' : 'app.dark'),
              })}
            >
              {theme === 'dark' ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
          </div>
        </header>

        <PrimaryClockPanel
          timeZone={primaryTimeZone}
          dateTimeUtc={primaryDateTimeUtc}
          options={timeZoneOptions}
          warning={warning}
          onTimeZoneChange={handlePrimaryZoneChange}
          onDateChange={handlePrimaryDateChange}
          onAmPmChange={handleAmPmChange}
          onClockTimeChange={handlePrimaryClockTimeChange}
        />

        <SecondaryClocksPanel
          primaryDateTimeUtc={primaryDateTimeUtc}
          primaryTimeZone={primaryTimeZone}
          secondaryTimeZones={secondaryTimeZones}
          options={timeZoneOptions}
          onAddClock={handleAddSecondaryClock}
          onRemoveClock={handleRemoveSecondaryClock}
          onClearAllClocks={handleClearAllSecondaryClocks}
          onReorderClocks={handleReorderSecondaryClocks}
        />

        <section
          aria-labelledby="chronosync-overview"
          className="rounded-lg border bg-card p-4 sm:p-5"
        >
          <h2
            id="chronosync-overview"
            className="text-xl font-semibold tracking-tight"
          >
            {t('overview.title')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('overview.description')}
          </p>

          <h3 className="mt-4 text-base font-semibold">
            {t('overview.subtitle')}
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>{t('overview.item1')}</li>
            <li>{t('overview.item2')}</li>
            <li>{t('overview.item3')}</li>
            <li>{t('overview.item4')}</li>
          </ul>
        </section>

        <section
          aria-labelledby="chronosync-faq"
          className="rounded-lg border bg-card p-4 sm:p-5"
        >
          <h2
            id="chronosync-faq"
            className="text-xl font-semibold tracking-tight"
          >
            {t('faq.title')}
          </h2>
          <div className="mt-3 space-y-3 text-sm">
            <details className="rounded-md border p-3">
              <summary className="cursor-pointer font-medium">
                {t('faq.q1')}
              </summary>
              <p className="mt-2 text-muted-foreground">{t('faq.a1')}</p>
            </details>

            <details className="rounded-md border p-3">
              <summary className="cursor-pointer font-medium">
                {t('faq.q2')}
              </summary>
              <p className="mt-2 text-muted-foreground">{t('faq.a2')}</p>
            </details>

            <details className="rounded-md border p-3">
              <summary className="cursor-pointer font-medium">
                {t('faq.q3')}
              </summary>
              <p className="mt-2 text-muted-foreground">{t('faq.a3')}</p>
            </details>
          </div>
        </section>

        <footer className="mt-auto border-t pt-4">
          <p className="text-center text-sm text-muted-foreground">
            {t('footer.madeBy')}{' '}
            <a
              href="https://www.linkedin.com/in/ravirupeliya"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Ravi Patel
            </a>{' '}
            ·{' '}
            <a
              href="https://github.com/ravirupeliya/chronosync"
              target="_blank"
              rel="noreferrer"
              aria-label={t('footer.githubAria')}
              title={t('footer.githubTitle')}
              className="inline-flex items-center transition-colors hover:text-foreground"
            >
              <img
                src={githubIconUrl}
                alt={t('footer.githubAlt')}
                className="size-4 dark:invert"
              />
            </a>
          </p>
        </footer>
      </div>

      {!hasConsentChoice && (
        <CookieConsentBanner onConsentSaved={setConsentState} />
      )}
      {analyticsConsentGranted && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </main>
  );
}

export default App;
