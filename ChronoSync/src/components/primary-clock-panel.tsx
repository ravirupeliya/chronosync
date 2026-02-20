import { useMemo } from 'react'
import { DateTime } from 'luxon'

import { AMPMToggle } from '@/components/am-pm-toggle'
import { Clock } from '@/components/clock'
import { DatePickerControl } from '@/components/date-picker-control'
import { TimeZoneSelect } from '@/components/time-zone-select'
import { Badge } from '@/components/ui/badge'
import type { TimeZoneOption } from '@/lib/time-utils'

type PrimaryClockPanelProps = {
  timeZone: string
  dateTimeUtc: DateTime
  options: TimeZoneOption[]
  warning?: string
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
  const local = dateTimeUtc.setZone(timeZone)
  const amPm = local.hour >= 12 ? 'PM' : 'AM'
  const selectedCity = useMemo(() => {
    const option = options.find((item) => item.value === timeZone)
    if (option) {
      return option.city
    }

    const segments = timeZone.split('/')
    return segments[segments.length - 1].replace(/_/g, ' ')
  }, [options, timeZone])

  return (
    <section className="space-y-3">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold">{selectedCity}</h2>
            <p className="text-sm text-muted-foreground">{local.toFormat('ccc, dd LLL yyyy, h:mm:ss a')}</p>
          </div>
          <Badge variant="secondary">Primary</Badge>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-muted/30 p-3">
          <Clock
            dateTimeUtc={dateTimeUtc}
            timeZone={timeZone}
            interactive
            size={230}
            onTimeChange={onClockTimeChange}
          />
          <div className="mt-2 text-center text-xs text-muted-foreground">
            Drag hour/minute hands to set the time
          </div>
        </div>

        <div className="grid content-start gap-4">
          <TimeZoneSelect
            value={timeZone}
            options={options}
            onChange={onTimeZoneChange}
            label="Primary time zone"
          />

          <DatePickerControl value={local.toJSDate()} onChange={onDateChange} />

          <AMPMToggle value={amPm} onChange={onAmPmChange} />

          <div className="rounded-lg border bg-card p-3 text-sm">
            <div className="font-medium">Current primary zone</div>
            <div className="mt-1 text-muted-foreground">{timeZone}</div>
          </div>

          {warning ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {warning}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
