import { useEffect, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { Moon, Sun } from 'lucide-react'
import logoDarkUrl from '@/assets/chronosync-logo-dark.svg'
import githubIconUrl from '@/assets/github.svg'
import logoLightUrl from '@/assets/chronosync-logo.svg'

import { PrimaryClockPanel } from '@/components/primary-clock-panel'
import { SecondaryClocksPanel } from '@/components/secondary-clocks-panel'
import { Button } from '@/components/ui/button'
import { initializeAnalytics, trackEvent, trackPageView } from '@/lib/analytics'
import { buildTimeZoneOptions, buildUtcFromLocalParts, localPartsFromUtc } from '@/lib/time-utils'

const DEFAULT_PRIMARY_ZONE = 'Pacific/Auckland'
const THEME_STORAGE_KEY = 'chronosync-theme'
const SECONDARY_CLOCKS_STORAGE_KEY = 'chronosync-secondary-clocks'
const DEFAULT_SECONDARY_TIME_ZONES = ['America/New_York', 'Europe/London', 'Asia/Tokyo']

type Theme = 'light' | 'dark'

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') {
    return saved
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getInitialSecondaryTimeZones = (): string[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_SECONDARY_TIME_ZONES
  }

  const saved = window.localStorage.getItem(SECONDARY_CLOCKS_STORAGE_KEY)
  if (!saved) {
    return DEFAULT_SECONDARY_TIME_ZONES
  }

  try {
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) {
      return DEFAULT_SECONDARY_TIME_ZONES
    }

    const uniqueZones = new Set<string>()
    for (const zone of parsed) {
      if (typeof zone === 'string' && zone.trim().length > 0) {
        uniqueZones.add(zone)
      }
    }

    return Array.from(uniqueZones)
  } catch {
    return DEFAULT_SECONDARY_TIME_ZONES
  }
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [primaryTimeZone, setPrimaryTimeZone] = useState(DEFAULT_PRIMARY_ZONE)
  const [primaryDateTimeUtc, setPrimaryDateTimeUtc] = useState(() => DateTime.now().toUTC().startOf('minute'))
  const [secondaryTimeZones, setSecondaryTimeZones] = useState<string[]>(getInitialSecondaryTimeZones)
  const [warning, setWarning] = useState<string | undefined>(undefined)

  const timeZoneReferenceYear = primaryDateTimeUtc.year
  const timeZoneReferenceMonth = primaryDateTimeUtc.month
  const timeZoneReferenceDay = primaryDateTimeUtc.day
  const timeZoneReferenceHour = primaryDateTimeUtc.hour
  const timeZoneReferenceMinute = primaryDateTimeUtc.minute

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
  )
  const applyLocalParts = (parts: {
    year: number
    month: number
    day: number
    hour: number
    minute: number
  }) => {
    const result = buildUtcFromLocalParts(parts, primaryTimeZone)
    setPrimaryDateTimeUtc(result.dateTimeUtc)
    setWarning(result.warning)
  }

  const handlePrimaryZoneChange = (zone: string) => {
    if (!zone) {
      return
    }

    setPrimaryTimeZone(zone)
    setSecondaryTimeZones((previous) => previous.filter((item) => item !== zone))
    setWarning(undefined)
    trackEvent('timezone_selected', {
      zone,
      selection_type: 'primary',
    })
  }

  const handlePrimaryDateChange = (date: Date) => {
    const local = localPartsFromUtc(primaryDateTimeUtc, primaryTimeZone)
    applyLocalParts({
      ...local,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    })
  }

  const handlePrimaryClockTimeChange = (hour24: number, minute: number) => {
    const currentLocal = primaryDateTimeUtc.setZone(primaryTimeZone)
    const currentTotalMinutes = currentLocal.hour * 60 + currentLocal.minute
    const nextTotalMinutes = hour24 * 60 + minute
    const minuteDelta = nextTotalMinutes - currentTotalMinutes

    let dayDelta = 0
    if (minuteDelta <= -12 * 60) {
      dayDelta = 1
    } else if (minuteDelta >= 12 * 60) {
      dayDelta = -1
    }

    const adjustedDate = currentLocal.plus({ days: dayDelta })

    applyLocalParts({
      year: adjustedDate.year,
      month: adjustedDate.month,
      day: adjustedDate.day,
      hour: hour24,
      minute,
    })
  }

  const handleAmPmChange = (value: 'AM' | 'PM') => {
    const local = localPartsFromUtc(primaryDateTimeUtc, primaryTimeZone)
    const isPm = local.hour >= 12
    const toggledHour =
      value === 'PM'
        ? isPm
          ? local.hour
          : local.hour + 12
        : isPm
          ? local.hour - 12
          : local.hour

    applyLocalParts({
      ...local,
      hour: toggledHour,
    })
  }

  const handleAddSecondaryClock = (zone: string) => {
    if (!zone || zone === primaryTimeZone) {
      return
    }

    setSecondaryTimeZones((previous) => {
      if (previous.includes(zone)) {
        return previous
      }

      trackEvent('secondary_clock_added', {
        zone,
        secondary_count: previous.length + 1,
      })
      return [...previous, zone]
    })
  }

  const handleRemoveSecondaryClock = (zone: string) => {
    setSecondaryTimeZones((previous) => previous.filter((item) => item !== zone))
    trackEvent('secondary_clock_removed', {
      zone,
    })
  }

  const handleClearAllSecondaryClocks = () => {
    if (secondaryTimeZones.length > 0) {
      trackEvent('secondary_clocks_cleared', {
        cleared_count: secondaryTimeZones.length,
      })
    }
    setSecondaryTimeZones([])
  }

  const handleReorderSecondaryClocks = (zones: string[]) => {
    if (zones.join('|') !== secondaryTimeZones.join('|')) {
      trackEvent('secondary_clocks_reordered', {
        secondary_count: zones.length,
      })
    }
    setSecondaryTimeZones(zones)
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem(SECONDARY_CLOCKS_STORAGE_KEY, JSON.stringify(secondaryTimeZones))
  }, [secondaryTimeZones])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPrimaryDateTimeUtc((previous) => previous.plus({ seconds: 1 }))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    initializeAnalytics()
    trackPageView()
  }, [])

  useEffect(() => {
    if (!warning) {
      return
    }

    trackEvent('dst_warning_shown', {
      warning_type: warning.toLowerCase().includes('ambiguous') ? 'ambiguous' : 'invalid_or_adjusted',
    })
  }, [warning])

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === 'dark' ? 'light' : 'dark'
      trackEvent('theme_toggled', {
        selected_theme: nextTheme,
      })
      return nextTheme
    })
  }

  const logoUrl = theme === 'dark' ? logoDarkUrl : logoLightUrl

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3 lg:px-8 lg:pb-8 lg:pt-4">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="ChronoSync logo" className="size-10 rounded-md" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">ChronoSync</h1>
              <p className="text-sm text-muted-foreground">
                World clock and time zone converter for global teams.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
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

        <section aria-labelledby="chronosync-overview" className="rounded-lg border bg-card p-4 sm:p-5">
          <h2 id="chronosync-overview" className="text-xl font-semibold tracking-tight">
            Time zone converter and world clock overview
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            ChronoSync helps you compare city times, convert local schedules, and pick meeting windows across
            distributed teams. The primary clock controls the source date and time, while secondary clocks stay in sync
            for instant global comparison.
          </p>

          <h3 className="mt-4 text-base font-semibold">What ChronoSync helps with</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Convert time between countries and IANA time zones.</li>
            <li>Check current time differences for remote teams and clients.</li>
            <li>Plan international meetings with daylight saving awareness.</li>
            <li>Track multiple office locations from a single UTC reference.</li>
          </ul>
        </section>

        <section aria-labelledby="chronosync-faq" className="rounded-lg border bg-card p-4 sm:p-5">
          <h2 id="chronosync-faq" className="text-xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="mt-3 space-y-3 text-sm">
            <details className="rounded-md border p-3">
              <summary className="cursor-pointer font-medium">Does ChronoSync handle daylight saving time?</summary>
              <p className="mt-2 text-muted-foreground">
                Yes. ChronoSync detects ambiguous and non-existent local times during DST transitions and shows a clear
                warning when an adjustment is required.
              </p>
            </details>

            <details className="rounded-md border p-3">
              <summary className="cursor-pointer font-medium">
                Can I compare more than one city at the same time?
              </summary>
              <p className="mt-2 text-muted-foreground">
                Yes. Add multiple secondary clocks, then drag and reorder them so your most important regions are always
                visible first.
              </p>
            </details>

            <details className="rounded-md border p-3">
              <summary className="cursor-pointer font-medium">Is ChronoSync free to use?</summary>
              <p className="mt-2 text-muted-foreground">
                Yes. ChronoSync is a browser-based app and currently free to use.
              </p>
            </details>
          </div>
        </section>

        <footer className="mt-auto border-t pt-4">
          <p className="text-center text-sm text-muted-foreground">
            Made with ❤️ in New Zealand by{' '}
            <a
              href="https://www.linkedin.com/in/ravirupeliya"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Ravi Patel
            </a>
            {' '}·{' '}
            <a
              href="https://github.com/ravirupeliya"
              target="_blank"
              rel="noreferrer"
              aria-label="Ravi Patel on GitHub"
              title="GitHub"
              className="inline-flex items-center transition-colors hover:text-foreground"
            >
              <img src={githubIconUrl} alt="GitHub" className="size-4 dark:invert" />
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}

export default App
