import { Switch } from '@/components/ui/switch'

type AMPMToggleProps = {
  value: 'AM' | 'PM'
  onChange: (value: 'AM' | 'PM') => void
}

export function AMPMToggle({ value, onChange }: AMPMToggleProps) {
  const isPm = value === 'PM'

  return (
    <div className="grid gap-2">
      <div className="inline-flex w-fit items-center gap-3 rounded-md border bg-card px-3 py-2">
        <span className={`text-sm font-medium ${isPm ? 'text-muted-foreground' : 'text-foreground'}`}>AM</span>
        <Switch
          checked={isPm}
          onCheckedChange={(checked) => onChange(checked ? 'PM' : 'AM')}
          aria-label="Toggle AM PM"
        />
        <span className={`text-sm font-medium ${isPm ? 'text-foreground' : 'text-muted-foreground'}`}>PM</span>
      </div>
    </div>
  )
}
