import { useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { Plus, Trash2 } from 'lucide-react'

import { Clock } from '@/components/clock'
import { CountryFlag } from '@/components/country-flag'
import { TimeZoneSelect } from '@/components/time-zone-select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { TimeZoneOption } from '@/lib/time-utils'

type SecondaryClocksPanelProps = {
  primaryDateTimeUtc: DateTime
  primaryTimeZone: string
  secondaryTimeZones: string[]
  options: TimeZoneOption[]
  onAddClock: (zone: string) => void
  onRemoveClock: (zone: string) => void
  onClearAllClocks: () => void
}

export function SecondaryClocksPanel({
  primaryDateTimeUtc,
  primaryTimeZone,
  secondaryTimeZones,
  options,
  onAddClock,
  onRemoveClock,
  onClearAllClocks,
}: SecondaryClocksPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingZone, setPendingZone] = useState('')

  const optionsMap = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options],
  )

  const addClock = () => {
    if (!pendingZone || pendingZone === primaryTimeZone || secondaryTimeZones.includes(pendingZone)) {
      return
    }

    onAddClock(pendingZone)
    setPendingZone('')
    setDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl">Secondary Clocks</CardTitle>
          <CardDescription>Synced to primary date and time</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onClearAllClocks}
            disabled={secondaryTimeZones.length === 0}
            aria-label="Clear all secondary clocks"
          >
            <Trash2 className="mr-1 size-4" />
            Clear all
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 size-4" />
                Add clock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add secondary clock</DialogTitle>
                <DialogDescription>
                  Choose another IANA time zone to track against the primary clock.
                </DialogDescription>
              </DialogHeader>
              <TimeZoneSelect
                value={pendingZone}
                options={options}
                onChange={setPendingZone}
                label="Secondary time zone"
                exclude={[primaryTimeZone, ...secondaryTimeZones]}
              />
              <DialogFooter>
                <Button className="cursor-pointer" onClick={addClock} disabled={!pendingZone}>
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="pt-3">
        {secondaryTimeZones.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No secondary clocks yet. Add a clock to compare regions.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {secondaryTimeZones.map((zone) => {
              const local = primaryDateTimeUtc.setZone(zone)
              const option = optionsMap.get(zone)

              return (
                <div key={zone} className="rounded-xl border bg-card p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <CountryFlag countryCode={option?.countryCode} className="size-4 rounded-xs" />
                        <span>{option?.city ?? zone}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{zone}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{option?.offsetLabel ?? ''}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${zone}`}
                        onClick={() => onRemoveClock(zone)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Clock dateTimeUtc={primaryDateTimeUtc} timeZone={zone} size={170} />
                  </div>

                  <div className="mt-3 text-center text-sm font-medium">{local.toFormat('ccc, dd LLL yyyy')}</div>
                  <div className="text-center text-lg font-semibold">{local.toFormat('h:mm a')}</div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
