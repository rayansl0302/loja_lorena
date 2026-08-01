import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloseCircleLinear, MinusCircleLinear, AddCircleLinear } from 'solar-icon-set'
import { useShop } from '@/store/ShopContext'
import { formatBRL, messages, whatsappLink } from '@/config/brand'
import { getProductIcon } from '@/config/productIcons'
import { toSafeImageSrc } from '@/utils/url'
import { formatCouponDiscountLabel } from '@/utils/coupon'
import { formatCpf, isValidCpf, normalizeCpf } from '@/utils/cpf'
import { formatPhone, isValidPhone } from '@/utils/phone'

export function CartDrawer() {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedCoupon,
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
    showToast,
  } = useShop()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [isSubmittingCoupon, setIsSubmittingCoupon] = useState(false)
  const [customerErrors, setCustomerErrors] = useState<string[]>([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  async function handleApplyCoupon(event: FormEvent) {
    event.preventDefault()
    setCouponError('')
    setIsSubmittingCoupon(true)
    const result = await applyCoupon(couponInput)
    setIsSubmittingCoupon(false)

    if (!result.ok) {
      setCouponError(result.reason)
      return
    }

    setCouponInput('')
  }

  function handleClearCoupon() {
    clearCoupon()
    setCouponError('')
  }

  function handleCpfBlur() {
    const digits = normalizeCpf(customerCpf)
    if (isValidCpf(digits)) {
      void autofillFromCpf(digits)
    }
  }

  async function handleCheckout() {
    if (cart.length === 0) {
      showToast(messages.emptyCart, 'error')
      return
    }

    const errors: string[] = []
    if (!customerName.trim()) errors.push('Informe seu nome completo.')
    if (!isValidCpf(customerCpf)) errors.push('Informe um CPF válido.')
    if (!isValidPhone(customerPhone)) errors.push('Informe um celular válido, com DDD.')

    if (errors.length > 0) {
      setCustomerErrors(errors)
      return
    }
    setCustomerErrors([])

    setIsCheckingOut(true)
    await Promise.all([saveCustomerProfile(), finalizeCouponUsage()])
    setIsCheckingOut(false)

    const message = messages.cartOrder(cart, cartTotal, {
      subtotal: cartSubtotal,
      discount: cartDiscount,
      coupon: appliedCoupon,
      customer: { name: customerName.trim(), cpf: customerCpf, phone: customerPhone },
    })
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog"
            aria-label="Carrinho de compras"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-noir-700 bg-noir-950 shadow-soft"
          >
            <header className="flex items-center justify-between border-b border-noir-700 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="font-display text-xl text-cream-100">Sua sacola</h2>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Fechar carrinho"
                className="flex h-10 w-10 items-center justify-center rounded-full text-cream-300 transition hover:bg-cream-100/10 hover:text-gold-400"
              >
                <CloseCircleLinear size={22} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              {cart.length === 0 ? (
                <p className="mt-10 text-center text-sm text-cream-300">
                  Sua sacola está vazia. Que tal explorar o catálogo?
                </p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {cart.map((item) => {
                    const Icon = getProductIcon(item.icon)
                    const imageSrc = toSafeImageSrc(item.image)
                    return (
                      <li
                        key={`${item.productId}-${item.size}`}
                        className="flex gap-3 rounded-2xl border border-noir-700 bg-noir-900 p-3 sm:gap-4"
                      >
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:h-16 sm:w-16"
                          style={{
                            background: `linear-gradient(150deg, ${item.color}22, ${item.color}55)`,
                          }}
                          aria-hidden
                        >
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Icon size={28} className="text-gold-400" />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-cream-100">{item.name}</p>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.productId, item.size)}
                              aria-label={`Remover ${item.name}`}
                              className="text-xs text-cream-300 transition hover:text-gold-400"
                            >
                              remover
                            </button>
                          </div>
                          <p className="text-xs text-cream-300">Tamanho {item.size}</p>
                          <div className="mt-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(item.productId, item.size, item.quantity - 1)
                                }
                                aria-label="Diminuir quantidade"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-cream-300 transition hover:text-gold-400"
                              >
                                <MinusCircleLinear size={20} />
                              </button>
                              <span className="w-5 text-center text-sm text-cream-100">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(item.productId, item.size, item.quantity + 1)
                                }
                                aria-label="Aumentar quantidade"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-cream-300 transition hover:text-gold-400"
                              >
                                <AddCircleLinear size={20} />
                              </button>
                            </div>
                            <span className="font-medium text-gold-400">
                              {formatBRL(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <footer className="border-t border-noir-700 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-5">
              {cart.length > 0 && (
                <div className="mb-4 flex flex-col gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-cream-300/70">
                    Seus dados
                  </p>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value)
                      setCustomerErrors([])
                    }}
                    placeholder="Nome completo"
                    aria-label="Nome completo"
                    className="rounded-xl border border-noir-700 bg-noir-800 px-3 py-2 text-sm text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatCpf(customerCpf)}
                    onChange={(e) => {
                      setCustomerCpf(e.target.value)
                      setCustomerErrors([])
                    }}
                    onBlur={handleCpfBlur}
                    placeholder="CPF"
                    aria-label="CPF"
                    maxLength={14}
                    className="rounded-xl border border-noir-700 bg-noir-800 px-3 py-2 text-sm text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatPhone(customerPhone)}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value)
                      setCustomerErrors([])
                    }}
                    placeholder="Celular com DDD"
                    aria-label="Celular"
                    maxLength={16}
                    className="rounded-xl border border-noir-700 bg-noir-800 px-3 py-2 text-sm text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
                  />
                  {customerErrors.length > 0 && (
                    <ul className="flex flex-col gap-0.5 text-xs text-wine-600" role="alert">
                      {customerErrors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mb-4 flex flex-col gap-2">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-gold-500/40 bg-gold-500/10 px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gold-400">
                          {formatCouponDiscountLabel(appliedCoupon)}
                        </p>
                        {appliedCoupon.firstPurchaseOnly && (
                          <p className="text-[11px] text-cream-300">
                            Válido para primeira compra — confirme com a loja no WhatsApp
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleClearCoupon}
                        className="shrink-0 text-xs text-cream-300 transition hover:text-gold-400"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase())
                          setCouponError('')
                        }}
                        placeholder="Cupom"
                        aria-label="Código do cupom"
                        className="min-w-0 flex-1 rounded-xl border border-noir-700 bg-noir-800 px-3 py-2 text-sm uppercase text-cream-100 outline-none transition placeholder:normal-case placeholder:text-cream-300/50 focus:border-gold-500"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingCoupon}
                        className="shrink-0 rounded-full border border-gold-500 px-4 py-2 text-sm font-medium text-gold-400 transition hover:bg-gold-500/10 disabled:opacity-50"
                      >
                        {isSubmittingCoupon ? 'Verificando...' : 'Aplicar'}
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-xs text-wine-600" role="alert">
                      {couponError}
                    </p>
                  )}
                </div>
              )}

              <div className="mb-4 flex flex-col gap-1.5">
                {cartDiscount > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm text-cream-300">
                      <span>Subtotal</span>
                      <span>{formatBRL(cartSubtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gold-400">
                      <span>Desconto</span>
                      <span>−{formatBRL(cartDiscount)}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cream-300">Total</span>
                  <span className="font-display text-2xl text-gold-400">{formatBRL(cartTotal)}</span>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-3.5 font-medium text-noir-950 shadow-card transition hover:bg-gold-400 disabled:opacity-60"
              >
                {isCheckingOut ? 'Enviando...' : 'Fechar pedido no WhatsApp'}
              </motion.button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
