import { createElement, type ComponentType, type SVGProps } from 'react'
import * as Flags from 'country-flag-icons/react/3x2'
import { Globe } from 'lucide-react'

import { cn } from '@/lib/utils'

type CountryFlagProps = {
  countryCode?: string
  className?: string
}

const getFlagComponent = (countryCode?: string): ComponentType<SVGProps<SVGSVGElement>> | null => {
  if (!countryCode || countryCode.length !== 2) {
    return null
  }

  const code = countryCode.toUpperCase()
  return (Flags as Record<string, ComponentType<SVGProps<SVGSVGElement>>>)[code] ?? null
}

export function CountryFlag({ countryCode, className }: CountryFlagProps) {
  const Flag = getFlagComponent(countryCode)

  if (!Flag) {
    return <Globe className={cn('text-muted-foreground', className)} aria-hidden />
  }

  return createElement(Flag, { className, 'aria-hidden': true })
}
