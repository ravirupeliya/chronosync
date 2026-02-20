import { DateTime } from 'luxon'

export type TimeZoneOption = {
  value: string
  city: string
  offsetLabel: string
  label: string
}

export type LocalDateTimeParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

const FALLBACK_ZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Australia/Sydney',
  'Pacific/Auckland',
]

export const getIanaTimeZones = (): string[] => {
  const intlWithZones = Intl as unknown as {
    supportedValuesOf?: (key: string) => string[]
  }

  const zones = intlWithZones.supportedValuesOf?.('timeZone') ?? FALLBACK_ZONES
  return zones.filter((zone) => DateTime.now().setZone(zone).isValid)
}

const formatOffset = (offsetMinutes: number): string => {
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absolute = Math.abs(offsetMinutes)
  const hours = Math.floor(absolute / 60)
  const minutes = absolute % 60
  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  return `GMT${sign}${hh}:${mm}`
}

const getCityName = (zone: string): string => {
  const segments = zone.split('/')
  const lastSegment = segments[segments.length - 1]
  return lastSegment.replace(/_/g, ' ')
}

export const buildTimeZoneOptions = (referenceUtc: DateTime): TimeZoneOption[] =>
  getIanaTimeZones()
    .map((zone) => {
      const zoned = referenceUtc.setZone(zone)
      const city = getCityName(zone)
      const offsetLabel = formatOffset(zoned.offset)

      return {
        value: zone,
        city,
        offsetLabel,
        label: `${city} (${offsetLabel})`,
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label))

export const localPartsFromUtc = (dateTimeUtc: DateTime, zone: string): LocalDateTimeParts => {
  const local = dateTimeUtc.setZone(zone)
  return {
    year: local.year,
    month: local.month,
    day: local.day,
    hour: local.hour,
    minute: local.minute,
  }
}

export type BuildDateTimeResult = {
  dateTimeUtc: DateTime
  warning?: string
}

export const buildUtcFromLocalParts = (
  parts: LocalDateTimeParts,
  zone: string,
): BuildDateTimeResult => {
  const startOfDay = DateTime.fromObject(
    {
      year: parts.year,
      month: parts.month,
      day: parts.day,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    },
    { zone },
  )

  const adjusted = startOfDay.plus({ hours: parts.hour, minutes: parts.minute })

  if (!adjusted.isValid) {
    return {
      dateTimeUtc: DateTime.now().toUTC(),
      warning: 'Selected date/time is invalid for this time zone. Falling back to current time.',
    }
  }

  const possibleOffsets = adjusted.getPossibleOffsets()
  const adjustedLocal = `${String(adjusted.hour).padStart(2, '0')}:${String(adjusted.minute).padStart(2, '0')}`
  const requestedLocal = `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`

  if (adjustedLocal !== requestedLocal) {
    return {
      dateTimeUtc: adjusted.toUTC(),
      warning: `The selected local time did not exist due to DST. It was adjusted to ${adjusted.toFormat('h:mm a')}.`,
    }
  }

  if (possibleOffsets.length > 1) {
    return {
      dateTimeUtc: adjusted.toUTC(),
      warning: 'The selected local time is ambiguous due to DST end. Using the earlier occurrence.',
    }
  }

  return { dateTimeUtc: adjusted.toUTC() }
}

export const formatPrimarySummary = (dateTimeUtc: DateTime, zone: string): string => {
  const local = dateTimeUtc.setZone(zone)
  const city = getCityName(zone)
  return `${local.toFormat('ccc, dd LLL yyyy, h:mm a')} – ${city}`
}
