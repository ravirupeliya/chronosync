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
  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">Date</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal" aria-label="Select date">
            <CalendarIcon className="mr-2 size-4" />
            {format(value, 'PPP')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={(date) => date && onChange(date)} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  )
}
