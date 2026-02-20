import { useEffect, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { Moon, Sun } from 'lucide-react'
import logoDarkUrl from '@/assets/chronosync-logo-dark.svg'
import logoLightUrl from '@/assets/chronosync-logo.svg'

import { PrimaryClockPanel } from '@/components/primary-clock-panel'
import { SecondaryClocksPanel } from '@/components/secondary-clocks-panel'
import { Button } from '@/components/ui/button'
import { buildTimeZoneOptions, buildUtcFromLocalParts, localPartsFromUtc } from '@/lib/time-utils'

const DEFAULT_PRIMARY_ZONE = 'Pacific/Auckland'
const THEME_STORAGE_KEY = 'chronosync-theme'

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

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [primaryTimeZone, setPrimaryTimeZone] = useState(DEFAULT_PRIMARY_ZONE)
  const [primaryDateTimeUtc, setPrimaryDateTimeUtc] = useState(() => DateTime.now().toUTC().startOf('minute'))
  const [secondaryTimeZones, setSecondaryTimeZones] = useState<string[]>([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
  ])
  const [warning, setWarning] = useState<string | undefined>(undefined)

  const timeZoneOptions = useMemo(() => buildTimeZoneOptions(primaryDateTimeUtc), [primaryDateTimeUtc])
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
    const local = localPartsFromUtc(primaryDateTimeUtc, primaryTimeZone)
    applyLocalParts({
      ...local,
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
      return [...previous, zone]
    })
  }

  const handleRemoveSecondaryClock = (zone: string) => {
    setSecondaryTimeZones((previous) => previous.filter((item) => item !== zone))
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPrimaryDateTimeUtc((previous) => previous.plus({ seconds: 1 }))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  const logoUrl = theme === 'dark' ? logoDarkUrl : logoLightUrl

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3 lg:px-8 lg:pb-8 lg:pt-4">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="ChronoSync logo" className="size-10 rounded-md" />
            <h1 className="text-3xl font-bold tracking-tight">ChronoSync</h1>
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
        />
      </div>
    </main>
  )
}

export default App
