import type { Category } from './product'

export type CouponDiscountType = 'percent' | 'fixed'
export type CouponScope = 'cart' | 'products' | 'category'

export interface Coupon {
  id: string
  code: string
  label: string
  discountType: CouponDiscountType
  value: number
  scope: CouponScope
  productIds: string[]
  category: Category | ''
  firstPurchaseOnly: boolean
  active: boolean
  expiresAt: string | null
}
