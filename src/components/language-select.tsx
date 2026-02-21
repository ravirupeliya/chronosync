import { Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CountryFlag } from '@/components/country-flag'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  LANGUAGE_COUNTRY_CODES,
  LANGUAGE_LABELS,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
} from '@/i18n/resources'

export function LanguageSelect() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const currentLanguage = normalizeLanguage(i18n.language)
  const currentLabel = useMemo(() => LANGUAGE_LABELS[currentLanguage], [currentLanguage])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label={t('language.label')}
          title={t('language.label')}
        >
          <CountryFlag countryCode={LANGUAGE_COUNTRY_CODES[currentLanguage]} className="size-4 rounded-xs" />
          <span className="hidden sm:inline">{currentLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-0" align="end">
        <Command>
          <CommandList>
            <CommandGroup>
              {SUPPORTED_LANGUAGES.map((language) => {
                const isSelected = currentLanguage === language

                return (
                  <CommandItem
                    key={language}
                    value={language}
                    onSelect={() => {
                      void i18n.changeLanguage(language)
                      setOpen(false)
                    }}
                  >
                    <Check className={`size-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                    <CountryFlag
                      countryCode={LANGUAGE_COUNTRY_CODES[language]}
                      className="size-4 rounded-xs"
                    />
                    <span>{LANGUAGE_LABELS[language]}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
