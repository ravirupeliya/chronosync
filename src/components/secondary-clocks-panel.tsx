import { useEffect, useMemo, useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
  onReorderClocks: (zones: string[]) => void
}

type SecondaryClockCardProps = {
  zone: string
  primaryDateTimeUtc: DateTime
  option?: TimeZoneOption
  onRemoveClock: (zone: string) => void
}

function SecondaryClockCard({ zone, primaryDateTimeUtc, option, onRemoveClock }: SecondaryClockCardProps) {
  const local = primaryDateTimeUtc.setZone(zone)

  return (
    <>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CountryFlag countryCode={option?.countryCode} className="size-4 rounded-xs" />
            <span>{option?.city ?? zone}</span>
          </div>
          <div className="text-xs text-muted-foreground">{zone}</div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
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
        <Clock dateTimeUtc={primaryDateTimeUtc} timeZone={zone} size={180} />
      </div>

      <div className="mt-3 text-center text-sm font-medium">{local.toFormat('ccc, dd LLL yyyy')}</div>
      <div className="text-center text-lg font-semibold">{local.toFormat('h:mm a')}</div>
    </>
  )
}

type SortableClockCardProps = SecondaryClockCardProps & {
  showPlaceholder: boolean
}

function SortableClockCard({
  zone,
  primaryDateTimeUtc,
  option,
  onRemoveClock,
  showPlaceholder,
}: SortableClockCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: zone })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      {showPlaceholder ? (
        <div className="flex min-h-80.5 items-center justify-center rounded-xl border border-dashed border-primary/60 bg-muted/30 p-4 text-sm text-muted-foreground">
          Drop to place clock
        </div>
      ) : (
        <div
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder ${zone}`}
          className={`rounded-xl border bg-card p-4 ${isDragging ? 'cursor-grabbing' : 'cursor-move'}`}
        >
          <SecondaryClockCard
            zone={zone}
            primaryDateTimeUtc={primaryDateTimeUtc}
            option={option}
            onRemoveClock={onRemoveClock}
          />
        </div>
      )}
      {isDragging ? <span className="sr-only">Dragging {zone}</span> : null}
    </div>
  )
}

export function SecondaryClocksPanel({
  primaryDateTimeUtc,
  primaryTimeZone,
  secondaryTimeZones,
  options,
  onAddClock,
  onRemoveClock,
  onClearAllClocks,
  onReorderClocks,
}: SecondaryClocksPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingZone, setPendingZone] = useState('')
  const [activeZone, setActiveZone] = useState<string | null>(null)
  const [previewOrder, setPreviewOrder] = useState<string[] | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

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

  const visibleOrder = previewOrder ?? secondaryTimeZones

  useEffect(() => {
    if (!activeZone) {
      document.body.style.cursor = ''
      document.documentElement.style.cursor = ''
      return
    }

    document.body.style.cursor = 'grabbing'
    document.documentElement.style.cursor = 'grabbing'

    return () => {
      document.body.style.cursor = ''
      document.documentElement.style.cursor = ''
    }
  }, [activeZone])

  const handleDragStart = (event: DragStartEvent) => {
    if (typeof event.active.id === 'string') {
      setActiveZone(event.active.id)
      setPreviewOrder(secondaryTimeZones)
    }
  }

  const handleDragOver = (activeId: string, overId: string) => {
    setPreviewOrder((current) => {
      const base = current ?? secondaryTimeZones
      const oldIndex = base.indexOf(activeId)
      const newIndex = base.indexOf(overId)

      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
        return base
      }

      return arrayMove(base, oldIndex, newIndex)
    })
  }

  const resetDragState = () => {
    setActiveZone(null)
    setPreviewOrder(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = typeof event.active.id === 'string' ? event.active.id : null
    const overId = typeof event.over?.id === 'string' ? event.over.id : null

    if (!activeId || !overId) {
      resetDragState()
      return
    }

    const nextOrder = previewOrder ?? secondaryTimeZones
    if (nextOrder.join('|') !== secondaryTimeZones.join('|')) {
      onReorderClocks(nextOrder)
    }

    resetDragState()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle className="text-xl">Secondary Clocks</CardTitle>
          <CardDescription>Synced to primary date and time</CardDescription>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive sm:hidden"
            onClick={onClearAllClocks}
            disabled={secondaryTimeZones.length === 0}
            aria-label="Clear all secondary clocks"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Clear all</span>
          </Button>
          <Button
            variant="outline"
            className="hidden border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive sm:inline-flex"
            onClick={onClearAllClocks}
            disabled={secondaryTimeZones.length === 0}
            aria-label="Clear all secondary clocks"
          >
            <Trash2 className="mr-1 size-4" />
            Clear all
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="sm:hidden" aria-label="Add secondary clock">
                <Plus className="size-4" />
                <span className="sr-only">Add clock</span>
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button className="hidden sm:inline-flex">
                <Plus className="mr-1 size-4" />
                Add clock
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
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
                <Button className="w-full cursor-pointer sm:w-auto" onClick={addClock} disabled={!pendingZone}>
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="pt-3 px-3 lg:px-6">
        {secondaryTimeZones.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No secondary clocks yet. Add a clock to compare regions.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={(event) => {
              const activeId = typeof event.active.id === 'string' ? event.active.id : null
              const overId = typeof event.over?.id === 'string' ? event.over.id : null

              if (!activeId || !overId || activeId === overId) {
                return
              }

              handleDragOver(activeId, overId)
            }}
            onDragEnd={handleDragEnd}
            onDragCancel={resetDragState}
          >
            <SortableContext items={visibleOrder} strategy={rectSortingStrategy}>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleOrder.map((zone) => (
                  <SortableClockCard
                    key={zone}
                    zone={zone}
                    primaryDateTimeUtc={primaryDateTimeUtc}
                    option={optionsMap.get(zone)}
                    onRemoveClock={onRemoveClock}
                    showPlaceholder={activeZone === zone}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeZone ? (
                <div className="w-full max-w-[320px] rounded-xl border border-primary/40 bg-card p-4 shadow-xl">
                  <SecondaryClockCard
                    zone={activeZone}
                    primaryDateTimeUtc={primaryDateTimeUtc}
                    option={optionsMap.get(activeZone)}
                    onRemoveClock={onRemoveClock}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </CardContent>
    </Card>
  )
}
