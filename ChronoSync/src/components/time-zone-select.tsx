import { useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

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

export function TimeZoneSelect({ value, options, onChange, label, exclude = [] }: TimeZoneSelectProps) {
  const [open, setOpen] = useState(false)

  const selected = useMemo(() => options.find((option) => option.value === value), [options, value])
  const available = useMemo(
    () => options.filter((option) => !exclude.includes(option.value) || option.value === value),
    [exclude, options, value],
  )

  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={label}
            className="w-full justify-between"
          >
            {selected?.label ?? 'Select a time zone'}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start" portalled={false}>
          <Command>
            <CommandInput placeholder="Search time zone..." />
            <CommandList>
              <CommandEmpty>No time zone found.</CommandEmpty>
              <CommandGroup>
                {available.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.value} ${option.label}`}
                    onSelect={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 size-4',
                        value === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <span>{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
