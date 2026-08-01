import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import type { Coupon, CouponDiscountType, CouponScope } from '@/types/coupon'
import type { Category, Product } from '@/types/product'
import { categories } from '@/config/brand'
import { normalizeCouponCode } from '@/utils/coupon'

type FormState = {
  code: string
  label: string
  discountType: CouponDiscountType
  value: string
  scope: CouponScope
  productIds: string[]
  category: Category | ''
  firstPurchaseOnly: boolean
  active: boolean
  expiresAt: string
}

const EMPTY_FORM: FormState = {
  code: '',
  label: '',
  discountType: 'percent',
  value: '10',
  scope: 'cart',
  productIds: [],
  category: '',
  firstPurchaseOnly: false,
  active: true,
  expiresAt: '',
}

function toFormState(coupon?: Coupon): FormState {
  if (!coupon) return EMPTY_FORM
  return {
    code: coupon.code,
    label: coupon.label,
    discountType: coupon.discountType,
    value: String(coupon.value),
    scope: coupon.scope,
    productIds: coupon.productIds,
    category: coupon.category,
    firstPurchaseOnly: coupon.firstPurchaseOnly,
    active: coupon.active !== false,
    expiresAt: coupon.expiresAt ?? '',
  }
}

interface CouponFormProps {
  editingCoupon: Coupon | null
  allCoupons: Coupon[]
  allProducts: Product[]
  onSubmit: (data: Omit<Coupon, 'id'>) => void
  onCancel: () => void
}

export function CouponForm({
  editingCoupon,
  allCoupons,
  allProducts,
  onSubmit,
  onCancel,
}: CouponFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(editingCoupon ?? undefined))
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    setForm(toFormState(editingCoupon ?? undefined))
    setErrors([])
  }, [editingCoupon])

  function toggleProduct(productId: string) {
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
    }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: string[] = []
    const code = normalizeCouponCode(form.code)
    const value = Number(form.value)

    if (!code) nextErrors.push('Informe o código do cupom.')
    if (!form.label.trim()) nextErrors.push('Informe o nome/campanha do cupom.')
    if (!value || value <= 0) nextErrors.push('Informe um valor de desconto maior que zero.')
    if (form.discountType === 'percent' && value > 100) {
      nextErrors.push('O percentual não pode ser maior que 100.')
    }
    if (form.scope === 'products' && form.productIds.length === 0) {
      nextErrors.push('Selecione ao menos uma peça para o cupom.')
    }
    if (form.scope === 'category' && !form.category) {
      nextErrors.push('Selecione a categoria do cupom.')
    }
    if (
      allCoupons.some(
        (coupon) => coupon.code === code && coupon.id !== editingCoupon?.id,
      )
    ) {
      nextErrors.push('Já existe um cupom com este código.')
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      code,
      label: form.label.trim(),
      discountType: form.discountType,
      value,
      scope: form.scope,
      productIds: form.scope === 'products' ? form.productIds : [],
      category: form.scope === 'category' ? form.category : '',
      firstPurchaseOnly: form.firstPurchaseOnly,
      active: form.active,
      expiresAt: form.expiresAt.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Código
          <input
            type="text"
            value={form.code}
            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
            placeholder="MAE10"
            className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 uppercase text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Nome / campanha
          <input
            type="text"
            value={form.label}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
            placeholder="Dia das Mães"
            className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Tipo de desconto
          <select
            value={form.discountType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                discountType: e.target.value as CouponDiscountType,
              }))
            }
            className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
          >
            <option value="percent">Percentual (%)</option>
            <option value="fixed">Valor fixo (R$)</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Valor
          <input
            type="number"
            min={0}
            step={form.discountType === 'percent' ? 1 : 0.01}
            value={form.value}
            onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
            className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-cream-100">
        Escopo
        <select
          value={form.scope}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, scope: e.target.value as CouponScope }))
          }
          className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
        >
          <option value="cart">Todo o carrinho</option>
          <option value="products">Peças específicas</option>
          <option value="category">Categoria</option>
        </select>
      </label>

      {form.scope === 'category' && (
        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Categoria
          <select
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value as Category | '' }))
            }
            className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
          >
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      )}

      {form.scope === 'products' && (
        <div className="flex flex-col gap-2 text-sm text-cream-100">
          Peças
          <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border border-noir-700 bg-noir-800 p-3">
            {allProducts.map((product) => (
              <label key={product.id} className="flex items-center gap-2 text-cream-300">
                <input
                  type="checkbox"
                  checked={form.productIds.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  className="h-4 w-4 accent-gold-500"
                />
                {product.name}
              </label>
            ))}
            {allProducts.length === 0 && (
              <p className="text-xs text-cream-300/70">Nenhuma peça cadastrada.</p>
            )}
          </div>
        </div>
      )}

      <label className="flex flex-col gap-1.5 text-sm text-cream-100">
        Validade (opcional)
        <input
          type="date"
          value={form.expiresAt}
          onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
          className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
        />
      </label>

      <div className="flex flex-col gap-2.5">
        <label className="flex items-center gap-2 text-sm text-cream-100">
          <input
            type="checkbox"
            checked={form.firstPurchaseOnly}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, firstPurchaseOnly: e.target.checked }))
            }
            className="h-4 w-4 accent-gold-500"
          />
          Somente primeira compra
        </label>
        <label className="flex items-center gap-2 text-sm text-cream-100">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
            className="h-4 w-4 accent-gold-500"
          />
          Cupom ativo
        </label>
      </div>

      {errors.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-1 rounded-xl bg-wine-600/15 px-4 py-3 text-sm text-wine-600"
        >
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </motion.ul>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          className="flex-1 rounded-full bg-gold-500 py-3 font-medium text-noir-950 transition hover:bg-gold-400"
        >
          {editingCoupon ? 'Salvar alterações' : 'Cadastrar cupom'}
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onCancel}
          className="rounded-full border border-noir-600 px-6 py-3 font-medium text-cream-300 transition hover:border-gold-500"
        >
          Cancelar
        </motion.button>
      </div>
    </form>
  )
}
