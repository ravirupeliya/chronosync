import { Switch } from '@/components/ui/switch'
import { useTranslation } from 'react-i18next'

type AMPMToggleProps = {
  value: 'AM' | 'PM'
  onChange: (value: 'AM' | 'PM') => void
}

export function AMPMToggle({ value, onChange }: AMPMToggleProps) {
  const { t } = useTranslation()
  const isPm = value === 'PM'

  return (
    <div className="grid gap-2">
      {/* <span className="text-sm font-medium">AM / PM</span> */}
      <div className="inline-flex h-9 w-fit items-center gap-3 rounded-md border bg-card px-3">
        <span className={`text-sm font-medium ${isPm ? 'text-muted-foreground' : 'text-foreground'}`}>AM</span>
        <Switch
          checked={isPm}
          onCheckedChange={(checked) => onChange(checked ? 'PM' : 'AM')}
          aria-label={t('primaryClock.amPmToggle')}
        />
        <span className={`text-sm font-medium ${isPm ? 'text-foreground' : 'text-muted-foreground'}`}>PM</span>
      </div>
    </div>
  )
}
