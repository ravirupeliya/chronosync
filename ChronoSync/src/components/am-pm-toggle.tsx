import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type AMPMToggleProps = {
  value: 'AM' | 'PM'
  onChange: (value: 'AM' | 'PM') => void
}

export function AMPMToggle({ value, onChange }: AMPMToggleProps) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">AM / PM</span>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(next) => {
          if (next === 'AM' || next === 'PM') {
            onChange(next)
          }
        }}
        className="justify-start"
        aria-label="AM PM toggle"
      >
        <ToggleGroupItem value="AM" aria-label="Set AM" className="min-w-14">
          AM
        </ToggleGroupItem>
        <ToggleGroupItem value="PM" aria-label="Set PM" className="min-w-14">
          PM
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
