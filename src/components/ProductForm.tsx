import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import type { Category, Product, Size } from '@/types/product'
import { categories, sizes, MAX_HIGHLIGHTS } from '@/config/brand'
import { isSafeHttpUrl, toSafeImageSrc } from '@/utils/url'
import { PRODUCT_ICON_OPTIONS, getProductIcon } from '@/config/productIcons'

type FormState = {
  name: string
  category: Category
  price: string
  sizes: Size[]
  description: string
  color: string
  icon: string
  image: string
  fixed: boolean
  featured: boolean
  highlight: boolean
}

const EMPTY_FORM: FormState = {
  name: '',
  category: categories[0],
  price: '',
  sizes: [],
  description: '',
  color: '#c9a227',
  icon: 'HangerBold',
  image: '',
  fixed: false,
  featured: false,
  highlight: false,
}

function toFormState(product?: Product): FormState {
  if (!product) return EMPTY_FORM
  return {
    name: product.name,
    category: product.category,
    price: String(product.price),
    sizes: product.sizes,
    description: product.description,
    color: product.color,
    icon: product.icon,
    image: product.image,
    fixed: product.fixed,
    featured: product.featured,
    highlight: product.highlight,
  }
}

interface ProductFormProps {
  editingProduct: Product | null
  allProducts: Product[]
  onSubmit: (data: Omit<Product, 'id'>) => void
  onCancel: () => void
}

export function ProductForm({ editingProduct, allProducts, onSubmit, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(editingProduct ?? undefined))
  const [errors, setErrors] = useState<string[]>([])
  const IconPreview = getProductIcon(form.icon)

  const otherHighlights = allProducts.filter(
    (product) => product.highlight && product.id !== editingProduct?.id,
  ).length
  const highlightLimitReached = otherHighlights >= MAX_HIGHLIGHTS && !form.highlight

  useEffect(() => {
    setForm(toFormState(editingProduct ?? undefined))
    setErrors([])
  }, [editingProduct])

  function toggleSize(size: Size) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const price = Number(form.price.replace(',', '.'))
    const nextErrors: string[] = []

    if (!form.name.trim()) nextErrors.push('Informe o nome da peça.')
    if (!price || price <= 0) nextErrors.push('Informe um preço maior que zero.')
    if (form.sizes.length === 0) nextErrors.push('Selecione ao menos um tamanho.')
    if (form.highlight && otherHighlights >= MAX_HIGHLIGHTS) {
      nextErrors.push(
        `Você já tem ${MAX_HIGHLIGHTS} peças em destaque na home. Remova uma antes de adicionar esta.`,
      )
    }
    if (form.image.trim() && !isSafeHttpUrl(form.image)) {
      nextErrors.push('A URL da imagem deve começar com http:// ou https://.')
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      name: form.name.trim(),
      category: form.category,
      price,
      sizes: form.sizes,
      description: form.description.trim(),
      color: form.color,
      icon: form.icon,
      image: form.image.trim(),
      fixed: form.fixed,
      featured: form.featured,
      highlight: form.highlight,
      active: editingProduct?.active ?? true,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Nome
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Categoria
          <select
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value as Category }))
            }
            className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Preço (R$)
          <input
            type="text"
            inputMode="decimal"
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            placeholder="0,00"
            className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Ícone
          <div className="flex items-center gap-2">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-noir-700 bg-noir-800 text-gold-400">
              <IconPreview size={20} />
            </span>
            <select
              value={form.icon}
              onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
              className="w-full rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
            >
              {PRODUCT_ICON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Cor do card
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
            className="h-11 w-full cursor-pointer rounded-xl border border-noir-700 bg-noir-800 px-1.5 py-1"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-cream-100">
        URL da imagem (opcional)
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-noir-700 bg-noir-800">
            {toSafeImageSrc(form.image) ? (
              <img src={toSafeImageSrc(form.image)} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[10px] text-cream-300/50">sem foto</span>
            )}
          </div>
          <input
            type="url"
            value={form.image}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
            placeholder="https://cdn.seusite.com/produtos/peca.jpg"
            className="w-full min-w-0 rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
          />
        </div>
        <span className="text-xs text-cream-300/60">
          Dimensão recomendada: 800×1000px (proporção 4:5), JPG/PNG/WebP até 2MB. Cole a URL
          pública do Cloudflare CDN/R2. Deixe em branco para usar o ícone colorido.
        </span>
      </label>

      <div className="flex flex-col gap-1.5 text-sm text-cream-100">
        Tamanhos disponíveis
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              aria-pressed={form.sizes.includes(size)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                form.sizes.includes(size)
                  ? 'border-gold-500 bg-gold-500 text-noir-950'
                  : 'border-noir-600 text-cream-300 hover:border-gold-500'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-cream-100">
        Descrição
        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="resize-none rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
        />
      </label>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-cream-100">
          <input
            type="checkbox"
            checked={form.fixed}
            onChange={(e) => setForm((prev) => ({ ...prev, fixed: e.target.checked }))}
            className="h-4 w-4 accent-gold-500"
          />
          Linha fixa / best-seller
        </label>
        <label className="flex items-center gap-2 text-sm text-cream-100">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
            className="h-4 w-4 accent-gold-500"
          />
          Novidade
        </label>
      </div>

      <div className="flex flex-col gap-1.5 rounded-xl border border-noir-700 bg-noir-800/60 px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-cream-100">
          <input
            type="checkbox"
            checked={form.highlight}
            disabled={highlightLimitReached}
            onChange={(e) => setForm((prev) => ({ ...prev, highlight: e.target.checked }))}
            className="h-4 w-4 accent-gold-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
          Destaque na home
        </label>
        <p className="pl-6 text-xs text-cream-300">
          {otherHighlights + (form.highlight ? 1 : 0)}/{MAX_HIGHLIGHTS} destaques usados
          {highlightLimitReached && ' — limite atingido, remova um destaque para adicionar outro.'}
        </p>
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
          {editingProduct ? 'Salvar alterações' : 'Cadastrar peça'}
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
