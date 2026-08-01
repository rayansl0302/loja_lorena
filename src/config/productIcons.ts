import {
  HangerBold,
  Hanger2Bold,
  TshirtBold,
  SkirtBold,
  Bag2Bold,
  BagHeartBold,
  CrownBold,
  GlassesBold,
  StarBold,
  HeartBold,
  type SolarIconProps,
} from 'solar-icon-set'
import type { ComponentType } from 'react'

export const PRODUCT_ICONS: Record<string, ComponentType<SolarIconProps>> = {
  HangerBold,
  Hanger2Bold,
  TshirtBold,
  SkirtBold,
  Bag2Bold,
  BagHeartBold,
  CrownBold,
  GlassesBold,
  StarBold,
  HeartBold,
}

export const PRODUCT_ICON_OPTIONS: { value: string; label: string }[] = [
  { value: 'HangerBold', label: 'Cabide' },
  { value: 'Hanger2Bold', label: 'Cabide duplo' },
  { value: 'TshirtBold', label: 'Camiseta' },
  { value: 'SkirtBold', label: 'Saia' },
  { value: 'Bag2Bold', label: 'Bolsa' },
  { value: 'BagHeartBold', label: 'Bolsa com coração' },
  { value: 'CrownBold', label: 'Coroa' },
  { value: 'GlassesBold', label: 'Óculos' },
  { value: 'StarBold', label: 'Estrela' },
  { value: 'HeartBold', label: 'Coração' },
]

const DEFAULT_ICON = 'HangerBold'

export function getProductIcon(name: string): ComponentType<SolarIconProps> {
  return PRODUCT_ICONS[name] ?? PRODUCT_ICONS[DEFAULT_ICON]
}
