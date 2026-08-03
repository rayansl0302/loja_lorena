import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { doc, updateDoc, writeBatch } from 'firebase/firestore'
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
import { db, isFirebaseConfigured } from '@/lib/firebase'
import { subscribeCollection, setItem, deleteItem, replaceCollectionWithSeed } from '@/lib/firestoreCrud'
import { useAuth } from './AuthContext'

const CART_KEY = 'lorena:cart'
const CART_COUPON_KEY = 'lorena:cart-coupon'
const CART_COUPON_CPF_KEY = 'lorena:cart-coupon-cpf'
const CUSTOMER_NAME_KEY = 'lorena:customer-name'
const CUSTOMER_CPF_KEY = 'lorena:customer-cpf'
const CUSTOMER_PHONE_KEY = 'lorena:customer-phone'

const PRODUCTS_COLLECTION = 'products'
const BANNERS_COLLECTION = 'banners'
const COUPONS_COLLECTION = 'coupons'

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
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  toggleProductActive: (id: string) => Promise<void>
  restoreSeed: () => Promise<void>

  banners: Banner[]
  activeBanners: Banner[]
  addBanner: (banner: Omit<Banner, 'id' | 'order'>) => Promise<void>
  updateBanner: (id: string, banner: Omit<Banner, 'id' | 'order'>) => Promise<void>
  deleteBanner: (id: string) => Promise<void>
  toggleBannerActive: (id: string) => Promise<void>
  moveBanner: (id: string, direction: 'up' | 'down') => Promise<void>
  restoreBannerSeed: () => Promise<void>

  coupons: Coupon[]
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>
  updateCoupon: (id: string, coupon: Omit<Coupon, 'id'>) => Promise<void>
  deleteCoupon: (id: string) => Promise<void>
  toggleCouponActive: (id: string) => Promise<void>
  restoreCouponSeed: () => Promise<void>

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

function friendlyFirestoreError(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
  if (code === 'permission-denied') {
    return 'Sem permissão para essa ação. Faça login como admin.'
  }
  if (code === 'unavailable') {
    return 'Sem conexão com o servidor agora. Tente novamente.'
  }
  return 'Não foi possível salvar. Tente novamente.'
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])

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

  const seededProductsRef = useRef(false)
  const seededBannersRef = useRef(false)
  const seededCouponsRef = useRef(false)

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ id: Date.now(), message, type })
  }, [])

  // --- Firestore: assinaturas em tempo real -------------------------------

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return
    return subscribeCollection<Product>(db, PRODUCTS_COLLECTION, setProducts, () =>
      showToast('Não foi possível carregar os produtos.', 'error'),
    )
  }, [showToast])

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return
    return subscribeCollection<Banner>(db, BANNERS_COLLECTION, setBanners, () =>
      showToast('Não foi possível carregar os banners.', 'error'),
    )
  }, [showToast])

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return
    return subscribeCollection<Coupon>(db, COUPONS_COLLECTION, setCoupons, () =>
      showToast('Não foi possível carregar os cupons.', 'error'),
    )
  }, [showToast])

  // --- Auto-seed: só quando o admin loga e a coleção está vazia -----------

  useEffect(() => {
    if (!isAuthenticated || !isFirebaseConfigured || !db) return
    if (products.length > 0 || seededProductsRef.current) return
    seededProductsRef.current = true
    replaceCollectionWithSeed(db, PRODUCTS_COLLECTION, [], seedProducts).catch(() => {
      seededProductsRef.current = false
    })
  }, [isAuthenticated, products.length])

  useEffect(() => {
    if (!isAuthenticated || !isFirebaseConfigured || !db) return
    if (banners.length > 0 || seededBannersRef.current) return
    seededBannersRef.current = true
    replaceCollectionWithSeed(db, BANNERS_COLLECTION, [], bannerSeed).catch(() => {
      seededBannersRef.current = false
    })
  }, [isAuthenticated, banners.length])

  useEffect(() => {
    if (!isAuthenticated || !isFirebaseConfigured || !db) return
    if (coupons.length > 0 || seededCouponsRef.current) return
    seededCouponsRef.current = true
    replaceCollectionWithSeed(db, COUPONS_COLLECTION, [], couponSeed).catch(() => {
      seededCouponsRef.current = false
    })
  }, [isAuthenticated, coupons.length])

  // --- Persistência local: só o estritamente necessário (sessão do visitante) --

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

  // --- Produtos -------------------------------------------------------------

  const addProduct = useCallback(
    async (product: Omit<Product, 'id'>) => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      try {
        await setItem(db, PRODUCTS_COLLECTION, { ...product, id: generateId(product.name) })
        showToast('Produto cadastrado com sucesso')
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [showToast],
  )

  const updateProduct = useCallback(
    async (id: string, product: Omit<Product, 'id'>) => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      try {
        await setItem(db, PRODUCTS_COLLECTION, { ...product, id })
        showToast('Produto atualizado')
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [showToast],
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      try {
        await deleteItem(db, PRODUCTS_COLLECTION, id)
        showToast('Produto removido', 'info')
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [showToast],
  )

  const toggleProductActive = useCallback(
    async (id: string) => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      const product = products.find((p) => p.id === id)
      const willBeActive = product ? product.active === false : true
      try {
        await updateDoc(doc(db, PRODUCTS_COLLECTION, id), { active: willBeActive })
        showToast(willBeActive ? 'Produto ativado' : 'Produto desativado', 'info')
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [products, showToast],
  )

  const activeProducts = useMemo(() => products.filter((p) => p.active !== false), [products])

  const restoreSeed = useCallback(async () => {
    if (!db) return showToast('Firebase não está configurado.', 'error')
    try {
      await replaceCollectionWithSeed(
        db,
        PRODUCTS_COLLECTION,
        products.map((p) => p.id),
        seedProducts,
      )
      showToast('Catálogo restaurado para o padrão', 'info')
    } catch (error) {
      showToast(friendlyFirestoreError(error), 'error')
    }
  }, [products, showToast])

  // --- Banners ----------------------------------------------------------

  const addBanner = useCallback(
    async (banner: Omit<Banner, 'id' | 'order'>) => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      const nextOrder = banners.length > 0 ? Math.max(...banners.map((b) => b.order)) + 1 : 0
      try {
        await setItem(db, BANNERS_COLLECTION, {
          ...banner,
          id: generateId(banner.title),
          order: nextOrder,
        })
        showToast('Banner cadastrado com sucesso')
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [banners, showToast],
  )

  const updateBanner = useCallback(
    async (id: string, banner: Omit<Banner, 'id' | 'order'>) => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      const current = banners.find((b) => b.id === id)
      try {
        await setItem(db, BANNERS_COLLECTION, { ...banner, id, order: current?.order ?? 0 })
        showToast('Banner atualizado')
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [banners, showToast],
  )

  const deleteBanner = useCallback(
    async (id: string) => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      try {
        await deleteItem(db, BANNERS_COLLECTION, id)
        showToast('Banner removido', 'info')
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [showToast],
  )

  const toggleBannerActive = useCallback(
    async (id: string) => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      const banner = banners.find((b) => b.id === id)
      const willBeActive = banner ? banner.active === false : true
      try {
        await updateDoc(doc(db, BANNERS_COLLECTION, id), { active: willBeActive })
        showToast(willBeActive ? 'Banner ativado' : 'Banner desativado', 'info')
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [banners, showToast],
  )

  const moveBanner = useCallback(
    async (id: string, direction: 'up' | 'down') => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      const sorted = [...banners].sort((a, b) => a.order - b.order)
      const index = sorted.findIndex((b) => b.id === id)
      const swapIndex = direction === 'up' ? index - 1 : index + 1
      if (index === -1 || swapIndex < 0 || swapIndex >= sorted.length) return

      const current = sorted[index]
      const swapTarget = sorted[swapIndex]
      try {
        const batch = writeBatch(db)
        batch.update(doc(db, BANNERS_COLLECTION, current.id), { order: swapTarget.order })
        batch.update(doc(db, BANNERS_COLLECTION, swapTarget.id), { order: current.order })
        await batch.commit()
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [banners, showToast],
  )

  const activeBanners = useMemo(
    () => banners.filter((b) => b.active !== false).sort((a, b) => a.order - b.order),
    [banners],
  )

  const restoreBannerSeed = useCallback(async () => {
    if (!db) return showToast('Firebase não está configurado.', 'error')
    try {
      await replaceCollectionWithSeed(
        db,
        BANNERS_COLLECTION,
        banners.map((b) => b.id),
        bannerSeed,
      )
      showToast('Banners restaurados para o padrão', 'info')
    } catch (error) {
      showToast(friendlyFirestoreError(error), 'error')
    }
  }, [banners, showToast])

  // --- Cupons -------------------------------------------------------------

  const addCoupon = useCallback(
    async (coupon: Omit<Coupon, 'id'>) => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      const code = normalizeCouponCode(coupon.code)
      if (coupons.some((c) => c.code === code)) {
        showToast('Já existe um cupom com esse código.', 'error')
        return
      }
      try {
        await setItem(db, COUPONS_COLLECTION, { ...coupon, code, id: generateId(code) })
        showToast('Cupom cadastrado com sucesso')
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [coupons, showToast],
  )

  const updateCoupon = useCallback(
    async (id: string, coupon: Omit<Coupon, 'id'>) => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      const code = normalizeCouponCode(coupon.code)
      if (coupons.some((c) => c.code === code && c.id !== id)) {
        showToast('Já existe um cupom com esse código.', 'error')
        return
      }
      try {
        await setItem(db, COUPONS_COLLECTION, { ...coupon, code, id })
        setAppliedCouponCode((prev) => {
          const current = coupons.find((c) => c.id === id)
          if (current && prev === current.code) return code
          return prev
        })
        showToast('Cupom atualizado')
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [coupons, showToast],
  )

  const deleteCoupon = useCallback(
    async (id: string) => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      const removed = coupons.find((c) => c.id === id)
      try {
        await deleteItem(db, COUPONS_COLLECTION, id)
        if (removed && appliedCouponCode === removed.code) {
          setAppliedCouponCode('')
          setAppliedCouponCpf('')
        }
        showToast('Cupom removido', 'info')
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [appliedCouponCode, coupons, showToast],
  )

  const toggleCouponActive = useCallback(
    async (id: string) => {
      if (!db) return showToast('Firebase não está configurado.', 'error')
      const coupon = coupons.find((c) => c.id === id)
      const willBeActive = coupon ? coupon.active === false : true
      try {
        await updateDoc(doc(db, COUPONS_COLLECTION, id), { active: willBeActive })
        if (coupon && !willBeActive && appliedCouponCode === coupon.code) {
          setAppliedCouponCode('')
          setAppliedCouponCpf('')
        }
        showToast(willBeActive ? 'Cupom ativado' : 'Cupom desativado', 'info')
      } catch (error) {
        showToast(friendlyFirestoreError(error), 'error')
      }
    },
    [appliedCouponCode, coupons, showToast],
  )

  const restoreCouponSeed = useCallback(async () => {
    if (!db) return showToast('Firebase não está configurado.', 'error')
    try {
      await replaceCollectionWithSeed(
        db,
        COUPONS_COLLECTION,
        coupons.map((c) => c.id),
        couponSeed,
      )
      setAppliedCouponCode('')
      setAppliedCouponCpf('')
      showToast('Cupons restaurados para o padrão', 'info')
    } catch (error) {
      showToast(friendlyFirestoreError(error), 'error')
    }
  }, [coupons, showToast])

  // --- Carrinho (permanece local — estado do visitante nesta sessão) -------

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
