import {
  GiftBold,
  SaleBold,
  TicketBold,
  TagPriceBold,
  CrownBold,
  StarBold,
  HeartBold,
  type SolarIconProps,
} from 'solar-icon-set'
import type { ComponentType } from 'react'

export const BANNER_ICONS: Record<string, ComponentType<SolarIconProps>> = {
  GiftBold,
  SaleBold,
  TicketBold,
  TagPriceBold,
  CrownBold,
  StarBold,
  HeartBold,
}

export const BANNER_ICON_OPTIONS: { value: string; label: string }[] = [
  { value: 'GiftBold', label: 'Presente' },
  { value: 'SaleBold', label: 'Promoção' },
  { value: 'TicketBold', label: 'Cupom' },
  { value: 'TagPriceBold', label: 'Etiqueta de preço' },
  { value: 'CrownBold', label: 'Coroa' },
  { value: 'StarBold', label: 'Estrela' },
  { value: 'HeartBold', label: 'Coração' },
]

const DEFAULT_ICON = 'GiftBold'

export function getBannerIcon(name: string): ComponentType<SolarIconProps> {
  return BANNER_ICONS[name] ?? BANNER_ICONS[DEFAULT_ICON]
}
