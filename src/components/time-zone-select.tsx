import { createElement, useMemo, useState, type ComponentType, type SVGProps } from 'react'
import * as Flags from 'country-flag-icons/react/3x2'
import { ChevronsUpDown, Globe } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { TimeZoneOption } from '@/lib/time-utils'

type TimeZoneSelectProps = {
  value: string
  options: TimeZoneOption[]
  onChange: (value: string) => void
  label: string
  exclude?: string[]
}

const INITIAL_VISIBLE_COUNT = 60
const LOAD_MORE_COUNT = 60
const LOAD_MORE_THRESHOLD_PX = 24

const getFlagComponent = (countryCode?: string): ComponentType<SVGProps<SVGSVGElement>> | null => {
  if (!countryCode || countryCode.length !== 2) {
    return null
  }

  const code = countryCode.toUpperCase()
  return (Flags as Record<string, ComponentType<SVGProps<SVGSVGElement>>>)[code] ?? null
}

const formatCountryCode = (countryCode?: string): string =>
  countryCode && countryCode.length === 2 ? countryCode.toUpperCase() : 'GL'

export function TimeZoneSelect({ value, options, onChange, label, exclude = [] }: TimeZoneSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  const selected = useMemo(() => options.find((option) => option.value === value), [options, value])
  const available = useMemo(
    () => options.filter((option) => !exclude.includes(option.value) || option.value === value),
    [exclude, options, value],
  )
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      if (!value) {
        return available
      }

      const selectedOption = available.find((option) => option.value === value)
      if (!selectedOption) {
        return available
      }

      return [selectedOption, ...available.filter((option) => option.value !== value)]
    }

    return available
      .filter((option) => {
        const haystack = `${option.label} ${option.city} ${option.country}`.toLowerCase()
        return haystack.includes(normalized)
      })
  }, [available, query, value])

  const visibleOptions = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])

  const handleListScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    const remaining = target.scrollHeight - target.scrollTop - target.clientHeight

    if (remaining <= LOAD_MORE_THRESHOLD_PX) {
      setVisibleCount((current) => Math.min(current + LOAD_MORE_COUNT, filtered.length))
    }
  }

  const selectedFlag = getFlagComponent(selected?.countryCode)

  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          setVisibleCount(INITIAL_VISIBLE_COUNT)
          if (!nextOpen) {
            setQuery('')
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={label}
            className="w-full justify-between"
          >
            <span className="flex min-w-0 items-center gap-2 truncate">
              {selectedFlag ? (
                createElement(selectedFlag, { className: 'size-4 rounded-xs', 'aria-hidden': true })
              ) : (
                <Globe className="size-4 text-muted-foreground" aria-hidden />
              )}
              <span className="text-xs text-muted-foreground">{formatCountryCode(selected?.countryCode)}</span>
              <span className="truncate">{selected?.label ?? 'Select a time zone'}</span>
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-120 p-0" align="start" portalled={false}>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search time zone..."
              value={query}
              onValueChange={(nextQuery) => {
                setQuery(nextQuery)
                setVisibleCount(INITIAL_VISIBLE_COUNT)
              }}
            />
            <CommandList onScroll={handleListScroll}>
              <CommandEmpty>No time zone found.</CommandEmpty>
              <CommandGroup>
                {visibleOptions.map((option) => {
                  const flag = getFlagComponent(option.countryCode)

                  return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onChange(option.value)
                      setQuery('')
                      setOpen(false)
                    }}
                  >
                    {flag ? (
                      createElement(flag, { className: 'mr-2 size-4 rounded-xs', 'aria-hidden': true })
                    ) : (
                      <Globe className="mr-2 size-4 text-muted-foreground" aria-hidden />
                    )}
                    <span className="mr-1 text-xs text-muted-foreground">
                      {formatCountryCode(option.countryCode)}
                    </span>
                    <span>{option.label}</span>
                  </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
