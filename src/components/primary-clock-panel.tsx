import { useMemo } from 'react'
import { DateTime } from 'luxon'
import { Hand } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AMPMToggle } from '@/components/am-pm-toggle'
import { Clock } from '@/components/clock'
import { CountryFlag } from '@/components/country-flag'
import { DatePickerControl } from '@/components/date-picker-control'
import { TimeZoneSelect } from '@/components/time-zone-select'
import { Badge } from '@/components/ui/badge'
import type { BuildDateTimeResult, TimeZoneOption } from '@/lib/time-utils'

type PrimaryClockPanelProps = {
  timeZone: string
  dateTimeUtc: DateTime
  options: TimeZoneOption[]
  warning?: BuildDateTimeResult['warning']
  onTimeZoneChange: (zone: string) => void
  onDateChange: (date: Date) => void
  onAmPmChange: (value: 'AM' | 'PM') => void
  onClockTimeChange: (hour24: number, minute: number) => void
}

export function PrimaryClockPanel({
  timeZone,
  dateTimeUtc,
  options,
  warning,
  onTimeZoneChange,
  onDateChange,
  onAmPmChange,
  onClockTimeChange,
}: PrimaryClockPanelProps) {
  const { t, i18n } = useTranslation()
  const local = dateTimeUtc.setZone(timeZone)
  const localWithLocale = local.setLocale(i18n.language)
  const amPm = local.hour >= 12 ? 'PM' : 'AM'
  const selectedOption = useMemo(() => {
    const option = options.find((item) => item.value === timeZone)
    if (option) {
      return option
    }

    const segments = timeZone.split('/')
    return {
      city: segments[segments.length - 1].replace(/_/g, ' '),
      countryCode: undefined,
    }
  }, [options, timeZone])

  return (
    <section className="space-y-3">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <CountryFlag countryCode={selectedOption.countryCode} className="size-5 rounded-xs" />
              <span>{selectedOption.city}</span>
            </h2>
            <p className="text-sm text-muted-foreground">{localWithLocale.toFormat('ccc, dd LLL yyyy, h:mm:ss a')}</p>
          </div>
          <Badge variant="secondary">{t('primaryClock.badge')}</Badge>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 p-3">
          <Clock
            dateTimeUtc={dateTimeUtc}
            timeZone={timeZone}
            interactive
            size={230}
            onTimeChange={onClockTimeChange}
          />
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Hand className="size-3.5" />
            <span>{t('primaryClock.dragHint')}</span>
          </div>
        </div>

        <div className="grid content-start gap-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 sm:grid-cols-2 lg:grid-cols-1 lg:gap-4">
            <TimeZoneSelect
              value={timeZone}
              options={options}
              onChange={onTimeZoneChange}
              label={t('primaryClock.timezoneLabel')}
            />

            <AMPMToggle value={amPm} onChange={onAmPmChange} />
          </div>

          <DatePickerControl value={local.toJSDate()} onChange={onDateChange} />

          <div className="hidden rounded-lg border bg-card p-3 text-sm sm:block">
            <div className="font-medium">{t('primaryClock.currentZone')}</div>
            <div className="mt-1 text-muted-foreground">{timeZone}</div>
          </div>

          {warning ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {warning.type === 'invalid' ? t('warnings.invalid') : null}
              {warning.type === 'ambiguous' ? t('warnings.ambiguous') : null}
              {warning.type === 'adjusted'
                ? t('warnings.adjusted', {
                    time: warning.adjustedDateTimeUtc
                      ?.setZone(timeZone)
                      .setLocale(i18n.language)
                      .toFormat('h:mm a'),
                  })
                : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
