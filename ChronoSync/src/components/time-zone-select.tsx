import { createElement, useMemo, useState, type ComponentType, type SVGProps } from 'react'
import * as Flags from 'country-flag-icons/react/3x2'
import { Check, ChevronsUpDown, Globe } from 'lucide-react'

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
import { cn } from '@/lib/utils'
import type { TimeZoneOption } from '@/lib/time-utils'

type TimeZoneSelectProps = {
  value: string
  options: TimeZoneOption[]
  onChange: (value: string) => void
  label: string
  exclude?: string[]
}

const getFlagComponent = (countryCode?: string): ComponentType<SVGProps<SVGSVGElement>> | null => {
  if (!countryCode || countryCode.length !== 2) {
    return null
  }

  const code = countryCode.toUpperCase()
  return (Flags as Record<string, ComponentType<SVGProps<SVGSVGElement>>>)[code] ?? null
}

export function TimeZoneSelect({ value, options, onChange, label, exclude = [] }: TimeZoneSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = useMemo(() => options.find((option) => option.value === value), [options, value])
  const available = useMemo(
    () => options.filter((option) => !exclude.includes(option.value) || option.value === value),
    [exclude, options, value],
  )
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return available.slice(0, 20)
    }

    return available
      .filter((option) => {
        const haystack = `${option.label} ${option.city} ${option.country}`.toLowerCase()
        return haystack.includes(normalized)
      })
      .slice(0, 250)
  }, [available, query])

  const selectedFlag = getFlagComponent(selected?.countryCode)

  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
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
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>No time zone found.</CommandEmpty>
              <CommandGroup>
                {filtered.map((option) => {
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
                    <Check
                      className={cn(
                        'mr-2 size-4',
                        value === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {flag ? (
                      createElement(flag, { className: 'mr-2 size-4 rounded-xs', 'aria-hidden': true })
                    ) : (
                      <Globe className="mr-2 size-4 text-muted-foreground" aria-hidden />
                    )}
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
