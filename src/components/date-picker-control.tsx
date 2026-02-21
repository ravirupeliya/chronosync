import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { de, enUS, es, fr, hi, zhCN } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const DATE_FNS_LOCALE_BY_PREFIX = [
  ['es', es],
  ['fr', fr],
  ['de', de],
  ['hi', hi],
  ['zh', zhCN],
] as const

type DatePickerControlProps = {
  value: Date
  onChange: (date: Date) => void
}

export function DatePickerControl({ value, onChange }: DatePickerControlProps) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(value)

  const dateFnsLocale =
    DATE_FNS_LOCALE_BY_PREFIX.find(([prefix]) => i18n.language.startsWith(prefix))?.[1] ?? enUS

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
      <span className="text-sm font-medium">{t('primaryClock.dateLabel')}</span>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal"
            aria-label={t('primaryClock.selectDate')}
          >
            <CalendarIcon className="mr-2 size-4" />
            {format(value, 'PPP', { locale: dateFnsLocale })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            month={month}
            onMonthChange={setMonth}
            onSelect={handleSelect}
            locale={dateFnsLocale}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
