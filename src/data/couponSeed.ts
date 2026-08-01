import type { Coupon } from '@/types/coupon'

export const couponSeed: Coupon[] = [
  {
    id: 'coupon-mae10',
    code: 'MAE10',
    label: 'Dia das Mães',
    discountType: 'percent',
    value: 10,
    scope: 'cart',
    productIds: [],
    category: '',
    firstPurchaseOnly: false,
    active: true,
    expiresAt: null,
  },
  {
    id: 'coupon-primeira-compra',
    code: 'PRIMEIRACOMPRA',
    label: 'Primeira compra',
    discountType: 'percent',
    value: 10,
    scope: 'cart',
    productIds: [],
    category: '',
    firstPurchaseOnly: true,
    active: true,
    expiresAt: null,
  },
]
