import type { Category } from './product'

export type BannerCtaType = 'whatsapp' | 'catalogo'

export interface Banner {
  id: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaType: BannerCtaType
  whatsappMessage: string
  category: Category | ''
  color: string
  icon: string
  image: string
  active: boolean
  order: number
}
