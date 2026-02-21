import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type DatePickerControlProps = {
  value: Date
  onChange: (date: Date) => void
}

export function DatePickerControl({ value, onChange }: DatePickerControlProps) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(value)

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      setMonth(value)
    }
  }

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      return
    }

    onChange(date)
    setMonth(date)
    setOpen(false)
  }

  return (
    <div className="lg:grid gap-2 hidden">
      <span className="text-sm font-medium">Date</span>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal" aria-label="Select date">
            <CalendarIcon className="mr-2 size-4" />
            {format(value, 'PPP')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            month={month}
            onMonthChange={setMonth}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
