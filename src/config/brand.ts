import type { Category, Size, CartItem } from '@/types/product'
import type { Coupon } from '@/types/coupon'
import { formatCouponDiscountLabel } from '@/utils/coupon'
import { formatCpf } from '@/utils/cpf'
import { formatPhone } from '@/utils/phone'

export const brand = {
  name: 'Impéria',
  founder: 'Lorenna Evylin',
  tagline: 'Seu estilo. Seu império.',
  whatsappNumber: '5511999999999',
  whatsappGroupLink: 'https://chat.whatsapp.com/exemplo',
  instagram: '@loredelicati_',
  instagramUrl: 'https://www.instagram.com/loredelicati_/',
  lightwidgetId: '',
  city: 'Salvador e Lauro de Freitas, BA',
}

export const categories: Category[] = ['Vestidos', 'Blusas', 'Calças', 'Saias', 'Conjuntos']

export const sizes: Size[] = ['PP', 'P', 'M', 'G', 'GG']

export const MAX_HIGHLIGHTS = 6

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function whatsappLink(message: string, phone: string = brand.whatsappNumber): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${digitsOnly(phone)}?text=${encoded}`
}

export const messages = {
  heroCta: 'Quero ver as novidades',
  productInquiry: (productName: string) =>
    `Olá! Vim pelo site e tenho interesse na peça "${productName}". Ainda está disponível?`,
  cartOrder: (
    items: CartItem[],
    total: number,
    options?: {
      subtotal?: number
      discount?: number
      coupon?: Coupon | null
      customer?: { name: string; cpf: string; phone: string }
    },
  ) => {
    const lines = items.map(
      (item) => `• ${item.name} — tamanho ${item.size} — qtd ${item.quantity} — ${formatBRL(item.price * item.quantity)}`,
    )
    const message = [`Olá! Gostaria de fazer o seguinte pedido:`, '']

    if (options?.customer) {
      message.push(`Nome: ${options.customer.name}`)
      message.push(`CPF: ${formatCpf(options.customer.cpf)}`)
      message.push(`Celular: ${formatPhone(options.customer.phone)}`)
      message.push('')
    }

    message.push(...lines, '')

    if (options?.coupon && options.discount && options.discount > 0) {
      message.push(`Subtotal: ${formatBRL(options.subtotal ?? total + options.discount)}`)
      message.push(`Cupom ${formatCouponDiscountLabel(options.coupon)}: −${formatBRL(options.discount)}`)
      message.push(`Total: ${formatBRL(total)}`)
      if (options.coupon.firstPurchaseOnly) {
        message.push('')
        message.push(
          'Obs.: este cupom é para primeira compra — por favor confirmem se posso usar.',
        )
      }
    } else {
      message.push(`Total: ${formatBRL(total)}`)
    }

    message.push('')
    message.push('Podemos combinar o pagamento e a entrega?')
    return message.join('\n')
  },
  emptyCart: 'Seu carrinho está vazio no momento.',
}
