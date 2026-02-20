import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { DateTime } from 'luxon'

type ClockProps = {
  dateTimeUtc: DateTime
  timeZone: string
  interactive?: boolean
  size?: number
  onTimeChange?: (hour24: number, minute: number) => void
}

type ActiveHand = 'hour' | 'minute' | null

export function Clock({
  dateTimeUtc,
  timeZone,
  interactive = false,
  size = 240,
  onTimeChange,
}: ClockProps) {
  const local = useMemo(() => dateTimeUtc.setZone(timeZone), [dateTimeUtc, timeZone])
  const [activeHand, setActiveHand] = useState<ActiveHand>(null)
  const [hoveredHand, setHoveredHand] = useState<ActiveHand>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const center = size / 2
  const radius = size / 2 - 10
  const minuteLength = radius * 0.72
  const hourLength = radius * 0.52
  const secondLength = radius * 0.8

  const minuteAngle = local.minute * 6
  const hourAngle = ((local.hour % 12) + local.minute / 60) * 30
  const secondAngle = local.second * 6

  const toPolarPoint = (angleDeg: number, length: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return {
      x: center + length * Math.cos(rad),
      y: center + length * Math.sin(rad),
    }
  }

  const minuteTip = toPolarPoint(minuteAngle, minuteLength)
  const hourTip = toPolarPoint(hourAngle, hourLength)
  const secondTip = toPolarPoint(secondAngle, secondLength)
  const handCursorClass = interactive
    ? activeHand
      ? 'cursor-grabbing'
      : 'cursor-grab'
    : ''

  const hourIsEmphasized = activeHand === 'hour' || (!activeHand && hoveredHand === 'hour')
  const minuteIsEmphasized = activeHand === 'minute' || (!activeHand && hoveredHand === 'minute')

  const getClockAngleFromPointer = (event: ReactPointerEvent<SVGSVGElement>): number => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) {
      return 0
    }

    const x = event.clientX - rect.left - center
    const y = event.clientY - rect.top - center
    const raw = (Math.atan2(y, x) * 180) / Math.PI
    return (raw + 450) % 360
  }

  const getPointerPosition = (event: ReactPointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) {
      return { x: center, y: center }
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const pickHand = (event: ReactPointerEvent<SVGSVGElement>): ActiveHand => {
    const pointer = getPointerPosition(event)
    const minuteDistance = Math.hypot(pointer.x - minuteTip.x, pointer.y - minuteTip.y)
    const hourDistance = Math.hypot(pointer.x - hourTip.x, pointer.y - hourTip.y)

    if (minuteDistance < hourDistance) {
      return 'minute'
    }
    return 'hour'
  }

  const updateTimeFromAngle = (angle: number, hand: ActiveHand) => {
    if (!onTimeChange || !hand) {
      return
    }

    if (hand === 'minute') {
      const minute = Math.round(angle / 6) % 60
      onTimeChange(local.hour, minute)
      return
    }

    const hour12 = Math.round(angle / 30) % 12
    const candidates = [hour12, hour12 + 12]
    const closest = candidates.reduce((best, candidate) => {
      const currentDiff = Math.abs(candidate - local.hour)
      const bestDiff = Math.abs(best - local.hour)
      return currentDiff < bestDiff ? candidate : best
    }, candidates[0])

    onTimeChange(closest, local.minute)
  }

  const handlePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!interactive || !onTimeChange) {
      return
    }

    const selectedHand = pickHand(event)
    setActiveHand(selectedHand)
    setHoveredHand(selectedHand)
    event.currentTarget.setPointerCapture(event.pointerId)
    updateTimeFromAngle(getClockAngleFromPointer(event), selectedHand)
  }

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!interactive) {
      return
    }

    if (!activeHand) {
      setHoveredHand(pickHand(event))
      return
    }

    updateTimeFromAngle(getClockAngleFromPointer(event), activeHand)
  }

  const handlePointerUp = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!interactive) {
      return
    }

    event.currentTarget.releasePointerCapture(event.pointerId)
    setActiveHand(null)
    setHoveredHand(null)
  }

  const handlePointerCancel = () => {
    if (!interactive) {
      return
    }

    setActiveHand(null)
    setHoveredHand(null)
  }

  const handlePointerLeave = () => {
    if (!interactive || activeHand) {
      return
    }

    setHoveredHand(null)
  }

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={interactive ? (activeHand ? 'touch-none cursor-grabbing' : 'touch-none') : ''}
      role={interactive ? 'slider' : 'img'}
      aria-label={`Analog clock for ${timeZone}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
    >
      <circle cx={center} cy={center} r={radius} className="fill-card stroke-border" strokeWidth={2} />

      {Array.from({ length: 60 }).map((_, index) => {
        const isQuarter = index % 15 === 0
        const isHourMarker = index % 5 === 0
        const outer = radius - 4
        const inner = outer - (isQuarter ? 12 : isHourMarker ? 8 : 4)

        const outerPoint = toPolarPoint(index * 6, outer)
        const innerPoint = toPolarPoint(index * 6, inner)

        return (
          <line
            key={index}
            x1={outerPoint.x}
            y1={outerPoint.y}
            x2={innerPoint.x}
            y2={innerPoint.y}
            className={isQuarter ? 'stroke-foreground' : 'stroke-muted-foreground'}
            strokeWidth={isQuarter ? 2.2 : isHourMarker ? 1.8 : 1}
          />
        )
      })}

      {/* {[
        { value: '12', angle: 0 },
        { value: '3', angle: 90 },
        { value: '6', angle: 180 },
        { value: '9', angle: 270 },
      ].map((marker) => {
        const point = toPolarPoint(marker.angle, radius - 24)

        return (
          <text
            key={marker.value}
            x={point.x}
            y={point.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground select-none text-sm font-semibold"
          >
            {marker.value}
          </text>
        )
      })} */}

      <line
        x1={center}
        y1={center}
        x2={hourTip.x}
        y2={hourTip.y}
        className={`stroke-primary ${hourIsEmphasized ? 'opacity-100' : 'opacity-85'} ${handCursorClass}`}
        style={{ transition: 'opacity 150ms ease-out, stroke-width 150ms ease-out' }}
        strokeWidth={hourIsEmphasized ? 7 : 6}
        strokeLinecap="round"
      />
      <line
        x1={center}
        y1={center}
        x2={minuteTip.x}
        y2={minuteTip.y}
        className={`stroke-foreground ${minuteIsEmphasized ? 'opacity-100' : 'opacity-85'} ${handCursorClass}`}
        style={{ transition: 'opacity 150ms ease-out, stroke-width 150ms ease-out' }}
        strokeWidth={minuteIsEmphasized ? 5 : 4}
        strokeLinecap="round"
      />
      <line
        x1={center}
        y1={center}
        x2={secondTip.x}
        y2={secondTip.y}
        className="stroke-destructive"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={center} cy={center} r={8} className="fill-primary" />
    </svg>
  )
}
