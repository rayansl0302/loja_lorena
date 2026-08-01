import type { Coupon } from '@/types/coupon'
import type { CartItem, Product } from '@/types/product'

export type CouponValidationError =
  | 'not_found'
  | 'inactive'
  | 'expired'
  | 'empty_cart'
  | 'no_eligible_items'

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase()
}

export function isCouponExpired(coupon: Coupon, now = new Date()): boolean {
  if (!coupon.expiresAt) return false
  const end = new Date(`${coupon.expiresAt}T23:59:59`)
  return Number.isNaN(end.getTime()) || now > end
}

function eligibleSubtotal(
  coupon: Coupon,
  cart: CartItem[],
  products: Product[],
): number {
  if (coupon.scope === 'cart') {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  if (coupon.scope === 'products') {
    const allowed = new Set(coupon.productIds)
    return cart.reduce((sum, item) => {
      if (!allowed.has(item.productId)) return sum
      return sum + item.price * item.quantity
    }, 0)
  }

  return cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product || product.category !== coupon.category) return sum
    return sum + item.price * item.quantity
  }, 0)
}

export function calculateCouponDiscount(
  coupon: Coupon,
  cart: CartItem[],
  products: Product[],
): number {
  const base = eligibleSubtotal(coupon, cart, products)
  if (base <= 0) return 0

  if (coupon.discountType === 'percent') {
    return Math.min(base, Math.round(((base * coupon.value) / 100) * 100) / 100)
  }

  return Math.min(base, coupon.value)
}

export function validateCouponForCart(
  coupon: Coupon | undefined,
  cart: CartItem[],
  products: Product[],
): CouponValidationError | null {
  if (!coupon) return 'not_found'
  if (coupon.active === false) return 'inactive'
  if (isCouponExpired(coupon)) return 'expired'
  if (cart.length === 0) return 'empty_cart'
  if (eligibleSubtotal(coupon, cart, products) <= 0) return 'no_eligible_items'
  return null
}

export function couponErrorMessage(error: CouponValidationError): string {
  switch (error) {
    case 'not_found':
      return 'Cupom não encontrado.'
    case 'inactive':
      return 'Este cupom está desativado.'
    case 'expired':
      return 'Este cupom expirou.'
    case 'empty_cart':
      return 'Adicione peças ao carrinho antes de aplicar o cupom.'
    case 'no_eligible_items':
      return 'Este cupom não se aplica às peças do carrinho.'
  }
}

export function formatCouponDiscountLabel(coupon: Coupon): string {
  if (coupon.discountType === 'percent') return `${coupon.code} (−${coupon.value}%)`
  return `${coupon.code} (−R$ ${coupon.value.toFixed(2).replace('.', ',')})`
}
