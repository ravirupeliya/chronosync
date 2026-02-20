import { DateTime } from 'luxon'

import { AMPMToggle } from '@/components/am-pm-toggle'
import { Clock } from '@/components/clock'
import { DatePickerControl } from '@/components/date-picker-control'
import { TimeZoneSelect } from '@/components/time-zone-select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { TimeZoneOption } from '@/lib/time-utils'

type PrimaryClockPanelProps = {
  timeZone: string
  dateTimeUtc: DateTime
  options: TimeZoneOption[]
  summary: string
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
  summary,
  warning,
  onTimeZoneChange,
  onDateChange,
  onAmPmChange,
  onClockTimeChange,
}: PrimaryClockPanelProps) {
  const local = dateTimeUtc.setZone(timeZone)
  const amPm = local.hour >= 12 ? 'PM' : 'AM'

  return (
    <Card className="border-primary/40 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-2xl">Primary Clock</CardTitle>
          <Badge variant="secondary">Primary</Badge>
        </div>
        <CardDescription className="text-sm">{summary}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 p-4">
          <Clock
            dateTimeUtc={dateTimeUtc}
            timeZone={timeZone}
            interactive
            size={280}
            onTimeChange={onClockTimeChange}
          />
          <div className="mt-3 text-center text-sm text-muted-foreground">
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
      </CardContent>
    </Card>
  )
}
