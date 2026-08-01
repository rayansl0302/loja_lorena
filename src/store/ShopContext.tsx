import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Product, Size } from '@/types/product'
import type { Banner } from '@/types/banner'
import type { Coupon } from '@/types/coupon'
import { seedProducts } from '@/data/seed'
import { bannerSeed } from '@/data/bannerSeed'
import { couponSeed } from '@/data/couponSeed'
import {
  calculateCouponDiscount,
  couponErrorMessage,
  normalizeCouponCode,
  validateCouponForCart,
} from '@/utils/coupon'
import { isValidCpf, normalizeCpf } from '@/utils/cpf'
import { isValidPhone, normalizePhone } from '@/utils/phone'
import { hasUsedCoupon, registerCouponUsage } from '@/lib/couponUsage'
import {
  lookupCustomerProfile,
  saveCustomerProfile as persistCustomerProfile,
} from '@/lib/customerProfile'

const PRODUCTS_KEY = 'lorena:products'
const CART_KEY = 'lorena:cart'
const BANNERS_KEY = 'lorena:banners'
const COUPONS_KEY = 'lorena:coupons'
const CART_COUPON_KEY = 'lorena:cart-coupon'
const CART_COUPON_CPF_KEY = 'lorena:cart-coupon-cpf'
const CUSTOMER_NAME_KEY = 'lorena:customer-name'
const CUSTOMER_CPF_KEY = 'lorena:customer-cpf'
const CUSTOMER_PHONE_KEY = 'lorena:customer-phone'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastState {
  id: number
  message: string
  type: ToastType
}

export type ApplyCouponResult =
  | { ok: true }
  | { ok: false; reason: string; requiresCpf?: boolean }

interface ShopContextValue {
  products: Product[]
  activeProducts: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void
  deleteProduct: (id: string) => void
  toggleProductActive: (id: string) => void
  restoreSeed: () => void

  banners: Banner[]
  activeBanners: Banner[]
  addBanner: (banner: Omit<Banner, 'id' | 'order'>) => void
  updateBanner: (id: string, banner: Omit<Banner, 'id' | 'order'>) => void
  deleteBanner: (id: string) => void
  toggleBannerActive: (id: string) => void
  moveBanner: (id: string, direction: 'up' | 'down') => void
  restoreBannerSeed: () => void

  coupons: Coupon[]
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void
  updateCoupon: (id: string, coupon: Omit<Coupon, 'id'>) => void
  deleteCoupon: (id: string) => void
  toggleCouponActive: (id: string) => void
  restoreCouponSeed: () => void

  cart: CartItem[]
  addToCart: (product: Product, size: Size, quantity?: number) => void
  removeFromCart: (productId: string, size: Size) => void
  updateCartQuantity: (productId: string, size: Size, quantity: number) => void
  clearCart: () => void
  cartSubtotal: number
  cartDiscount: number
  cartTotal: number
  cartCount: number
  appliedCoupon: Coupon | null
  appliedCouponCpf: string
  applyCoupon: (code: string) => Promise<ApplyCouponResult>
  clearCoupon: () => void
  finalizeCouponUsage: () => Promise<void>

  customerName: string
  customerCpf: string
  customerPhone: string
  setCustomerName: (value: string) => void
  setCustomerCpf: (value: string) => void
  setCustomerPhone: (value: string) => void
  autofillFromCpf: (cpfDigits: string) => Promise<void>
  saveCustomerProfile: () => Promise<void>

  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void

  toast: ToastState | null
  showToast: (message: string, type?: ToastType) => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

function stripDiacritics(value: string): string {
  return Array.from(value.normalize('NFD'))
    .filter((char) => {
      const code = char.charCodeAt(0)
      return code < 0x300 || code > 0x36f
    })
    .join('')
}

function generateId(name: string): string {
  const slug = stripDiacritics(name.toLowerCase())
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${slug}-${Date.now().toString(36)}`
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    readStorage(PRODUCTS_KEY, seedProducts),
  )
  const [banners, setBanners] = useState<Banner[]>(() => readStorage(BANNERS_KEY, bannerSeed))
  const [coupons, setCoupons] = useState<Coupon[]>(() => readStorage(COUPONS_KEY, couponSeed))
  const [cart, setCart] = useState<CartItem[]>(() => readStorage(CART_KEY, []))
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>(() =>
    readStorage(CART_COUPON_KEY, ''),
  )
  const [appliedCouponCpf, setAppliedCouponCpf] = useState<string>(() =>
    readStorage(CART_COUPON_CPF_KEY, ''),
  )
  const [customerName, setCustomerName] = useState<string>(() =>
    readStorage(CUSTOMER_NAME_KEY, ''),
  )
  const [customerCpf, setCustomerCpf] = useState<string>(() => readStorage(CUSTOMER_CPF_KEY, ''))
  const [customerPhone, setCustomerPhone] = useState<string>(() =>
    readStorage(CUSTOMER_PHONE_KEY, ''),
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    writeStorage(PRODUCTS_KEY, products)
  }, [products])

  useEffect(() => {
    writeStorage(BANNERS_KEY, banners)
  }, [banners])

  useEffect(() => {
    writeStorage(COUPONS_KEY, coupons)
  }, [coupons])

  useEffect(() => {
    writeStorage(CART_KEY, cart)
  }, [cart])

  useEffect(() => {
    writeStorage(CART_COUPON_KEY, appliedCouponCode)
  }, [appliedCouponCode])

  useEffect(() => {
    writeStorage(CART_COUPON_CPF_KEY, appliedCouponCpf)
  }, [appliedCouponCpf])

  useEffect(() => {
    writeStorage(CUSTOMER_NAME_KEY, customerName)
  }, [customerName])

  useEffect(() => {
    writeStorage(CUSTOMER_CPF_KEY, customerCpf)
  }, [customerCpf])

  useEffect(() => {
    writeStorage(CUSTOMER_PHONE_KEY, customerPhone)
  }, [customerPhone])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ id: Date.now(), message, type })
  }, [])

  const addProduct = useCallback(
    (product: Omit<Product, 'id'>) => {
      setProducts((prev) => [...prev, { ...product, id: generateId(product.name) }])
      showToast('Produto cadastrado com sucesso')
    },
    [showToast],
  )

  const updateProduct = useCallback(
    (id: string, product: Omit<Product, 'id'>) => {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...product, id } : p)))
      showToast('Produto atualizado')
    },
    [showToast],
  )

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      showToast('Produto removido', 'info')
    },
    [showToast],
  )

  const toggleProductActive = useCallback(
    (id: string) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, active: !(p.active !== false) } : p)),
      )
      const product = products.find((p) => p.id === id)
      const willBeActive = product ? product.active === false : true
      showToast(willBeActive ? 'Produto ativado' : 'Produto desativado', 'info')
    },
    [products, showToast],
  )

  const activeProducts = useMemo(() => products.filter((p) => p.active !== false), [products])

  const restoreSeed = useCallback(() => {
    setProducts(seedProducts)
    showToast('Catálogo restaurado para o padrão', 'info')
  }, [showToast])

  const addBanner = useCallback(
    (banner: Omit<Banner, 'id' | 'order'>) => {
      setBanners((prev) => {
        const nextOrder = prev.length > 0 ? Math.max(...prev.map((b) => b.order)) + 1 : 0
        return [...prev, { ...banner, id: generateId(banner.title), order: nextOrder }]
      })
      showToast('Banner cadastrado com sucesso')
    },
    [showToast],
  )

  const updateBanner = useCallback(
    (id: string, banner: Omit<Banner, 'id' | 'order'>) => {
      setBanners((prev) =>
        prev.map((b) => (b.id === id ? { ...banner, id, order: b.order } : b)),
      )
      showToast('Banner atualizado')
    },
    [showToast],
  )

  const deleteBanner = useCallback(
    (id: string) => {
      setBanners((prev) => prev.filter((b) => b.id !== id))
      showToast('Banner removido', 'info')
    },
    [showToast],
  )

  const toggleBannerActive = useCallback(
    (id: string) => {
      setBanners((prev) =>
        prev.map((b) => (b.id === id ? { ...b, active: !(b.active !== false) } : b)),
      )
      const banner = banners.find((b) => b.id === id)
      const willBeActive = banner ? banner.active === false : true
      showToast(willBeActive ? 'Banner ativado' : 'Banner desativado', 'info')
    },
    [banners, showToast],
  )

  const moveBanner = useCallback((id: string, direction: 'up' | 'down') => {
    setBanners((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const index = sorted.findIndex((b) => b.id === id)
      const swapIndex = direction === 'up' ? index - 1 : index + 1
      if (index === -1 || swapIndex < 0 || swapIndex >= sorted.length) return prev

      const current = sorted[index]
      const swapTarget = sorted[swapIndex]
      const currentOrder = current.order
      const swapOrder = swapTarget.order

      return prev.map((b) => {
        if (b.id === current.id) return { ...b, order: swapOrder }
        if (b.id === swapTarget.id) return { ...b, order: currentOrder }
        return b
      })
    })
  }, [])

  const activeBanners = useMemo(
    () => banners.filter((b) => b.active !== false).sort((a, b) => a.order - b.order),
    [banners],
  )

  const restoreBannerSeed = useCallback(() => {
    setBanners(bannerSeed)
    showToast('Banners restaurados para o padrão', 'info')
  }, [showToast])

  const addCoupon = useCallback(
    (coupon: Omit<Coupon, 'id'>) => {
      const code = normalizeCouponCode(coupon.code)
      setCoupons((prev) => {
        if (prev.some((c) => c.code === code)) {
          return prev
        }
        return [...prev, { ...coupon, code, id: generateId(code) }]
      })
      showToast('Cupom cadastrado com sucesso')
    },
    [showToast],
  )

  const updateCoupon = useCallback(
    (id: string, coupon: Omit<Coupon, 'id'>) => {
      const code = normalizeCouponCode(coupon.code)
      setCoupons((prev) => {
        if (prev.some((c) => c.code === code && c.id !== id)) {
          return prev
        }
        return prev.map((c) => (c.id === id ? { ...coupon, code, id } : c))
      })
      setAppliedCouponCode((prev) => {
        const current = coupons.find((c) => c.id === id)
        if (current && prev === current.code) return code
        return prev
      })
      showToast('Cupom atualizado')
    },
    [coupons, showToast],
  )

  const deleteCoupon = useCallback(
    (id: string) => {
      const removed = coupons.find((c) => c.id === id)
      setCoupons((prev) => prev.filter((c) => c.id !== id))
      if (removed && appliedCouponCode === removed.code) {
        setAppliedCouponCode('')
        setAppliedCouponCpf('')
      }
      showToast('Cupom removido', 'info')
    },
    [appliedCouponCode, coupons, showToast],
  )

  const toggleCouponActive = useCallback(
    (id: string) => {
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, active: !(c.active !== false) } : c)),
      )
      const coupon = coupons.find((c) => c.id === id)
      const willBeActive = coupon ? coupon.active === false : true
      if (coupon && !willBeActive && appliedCouponCode === coupon.code) {
        setAppliedCouponCode('')
        setAppliedCouponCpf('')
      }
      showToast(willBeActive ? 'Cupom ativado' : 'Cupom desativado', 'info')
    },
    [appliedCouponCode, coupons, showToast],
  )

  const restoreCouponSeed = useCallback(() => {
    setCoupons(couponSeed)
    setAppliedCouponCode('')
    setAppliedCouponCpf('')
    showToast('Cupons restaurados para o padrão', 'info')
  }, [showToast])

  const addToCart = useCallback(
    (product: Product, size: Size, quantity = 1) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product.id && item.size === size)
        if (existing) {
          return prev.map((item) =>
            item.productId === product.id && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        }
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            size,
            quantity,
            color: product.color,
            icon: product.icon,
            image: product.image ?? '',
          },
        ]
      })
      showToast(`${product.name} adicionado ao carrinho`)
    },
    [showToast],
  )

  const removeFromCart = useCallback((productId: string, size: Size) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)))
  }, [])

  const updateCartQuantity = useCallback((productId: string, size: Size, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => !(item.productId === productId && item.size === size))
      }
      return prev.map((item) =>
        item.productId === productId && item.size === size ? { ...item, quantity } : item,
      )
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    setAppliedCouponCode('')
    setAppliedCouponCpf('')
  }, [])

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  )

  const appliedCoupon = useMemo(() => {
    if (!appliedCouponCode) return null
    const coupon = coupons.find((c) => c.code === appliedCouponCode)
    if (!coupon) return null
    const error = validateCouponForCart(coupon, cart, products)
    if (error) return null
    return coupon
  }, [appliedCouponCode, cart, coupons, products])

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon) return 0
    return calculateCouponDiscount(appliedCoupon, cart, products)
  }, [appliedCoupon, cart, products])

  const cartTotal = useMemo(
    () => Math.max(0, cartSubtotal - cartDiscount),
    [cartDiscount, cartSubtotal],
  )
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

  useEffect(() => {
    if (!appliedCouponCode) return
    const coupon = coupons.find((c) => c.code === appliedCouponCode)
    const error = validateCouponForCart(coupon, cart, products)
    if (error) {
      setAppliedCouponCode('')
      setAppliedCouponCpf('')
    }
  }, [appliedCouponCode, cart, coupons, products])

  const applyCoupon = useCallback(
    async (code: string): Promise<ApplyCouponResult> => {
      const normalized = normalizeCouponCode(code)
      const coupon = coupons.find((c) => c.code === normalized)
      const error = validateCouponForCart(coupon, cart, products)
      if (error) {
        return { ok: false, reason: couponErrorMessage(error) }
      }

      if (coupon!.requireCpf) {
        const cpfDigits = normalizeCpf(customerCpf)
        if (!isValidCpf(cpfDigits)) {
          return {
            ok: false,
            reason: 'Preencha um CPF válido em "Seus dados" para usar este cupom.',
            requiresCpf: true,
          }
        }
        try {
          const used = await hasUsedCoupon(normalized, cpfDigits)
          if (used) {
            return {
              ok: false,
              reason: 'Este cupom já foi usado com este CPF.',
              requiresCpf: true,
            }
          }
        } catch {
          return {
            ok: false,
            reason: 'Não foi possível validar o cupom agora. Tente novamente em instantes.',
            requiresCpf: true,
          }
        }
        setAppliedCouponCpf(cpfDigits)
      } else {
        setAppliedCouponCpf('')
      }

      setAppliedCouponCode(normalized)
      showToast(`Cupom ${normalized} aplicado`)
      return { ok: true }
    },
    [cart, coupons, customerCpf, products, showToast],
  )

  const clearCoupon = useCallback(() => {
    setAppliedCouponCode('')
    setAppliedCouponCpf('')
    showToast('Cupom removido', 'info')
  }, [showToast])

  const finalizeCouponUsage = useCallback(async () => {
    if (!appliedCoupon?.requireCpf || !appliedCouponCpf) return
    await registerCouponUsage(appliedCoupon.code, appliedCouponCpf)
  }, [appliedCoupon, appliedCouponCpf])

  const autofillFromCpf = useCallback(async (cpfDigits: string) => {
    const profile = await lookupCustomerProfile(cpfDigits)
    if (!profile) return
    setCustomerName((prev) => (prev.trim() ? prev : profile.name))
    setCustomerPhone((prev) => (prev.trim() ? prev : profile.phone))
  }, [])

  const saveCustomerProfile = useCallback(async () => {
    const cpfDigits = normalizeCpf(customerCpf)
    if (!customerName.trim() || !isValidCpf(cpfDigits) || !isValidPhone(customerPhone)) return
    await persistCustomerProfile(cpfDigits, {
      name: customerName.trim(),
      phone: normalizePhone(customerPhone),
    })
  }, [customerName, customerCpf, customerPhone])

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), [])

  const value: ShopContextValue = {
    products,
    activeProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    restoreSeed,
    banners,
    activeBanners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerActive,
    moveBanner,
    restoreBannerSeed,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponActive,
    restoreCouponSeed,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    cartCount,
    appliedCoupon,
    appliedCouponCpf,
    applyCoupon,
    clearCoupon,
    finalizeCouponUsage,
    customerName,
    customerCpf,
    customerPhone,
    setCustomerName,
    setCustomerCpf,
    setCustomerPhone,
    autofillFromCpf,
    saveCustomerProfile,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    toast,
    showToast,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop deve ser usado dentro de ShopProvider')
  return ctx
}
