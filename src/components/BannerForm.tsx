import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import type { Banner, BannerCtaType } from '@/types/banner'
import type { Category } from '@/types/product'
import { categories } from '@/config/brand'
import { BANNER_ICON_OPTIONS, getBannerIcon } from '@/config/bannerIcons'
import { isSafeHttpUrl, toSafeImageSrc } from '@/utils/url'

type FormState = {
  title: string
  subtitle: string
  ctaLabel: string
  ctaType: BannerCtaType
  whatsappMessage: string
  category: Category | ''
  color: string
  icon: string
  image: string
}

const EMPTY_FORM: FormState = {
  title: '',
  subtitle: '',
  ctaLabel: 'Falar no WhatsApp',
  ctaType: 'whatsapp',
  whatsappMessage: '',
  category: '',
  color: '#d4af37',
  icon: 'GiftBold',
  image: '',
}

function toFormState(banner?: Banner): FormState {
  if (!banner) return EMPTY_FORM
  return {
    title: banner.title,
    subtitle: banner.subtitle,
    ctaLabel: banner.ctaLabel,
    ctaType: banner.ctaType,
    whatsappMessage: banner.whatsappMessage,
    category: banner.category,
    color: banner.color,
    icon: banner.icon,
    image: banner.image ?? '',
  }
}

interface BannerFormProps {
  editingBanner: Banner | null
  onSubmit: (data: Omit<Banner, 'id' | 'order'>) => void
  onCancel: () => void
}

export function BannerForm({ editingBanner, onSubmit, onCancel }: BannerFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(editingBanner ?? undefined))
  const [errors, setErrors] = useState<string[]>([])
  const IconPreview = getBannerIcon(form.icon)

  useEffect(() => {
    setForm(toFormState(editingBanner ?? undefined))
    setErrors([])
  }, [editingBanner])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: string[] = []

    if (!form.title.trim()) nextErrors.push('Informe o título do banner.')
    if (!form.ctaLabel.trim()) nextErrors.push('Informe o texto do botão.')
    if (form.ctaType === 'whatsapp' && !form.whatsappMessage.trim()) {
      nextErrors.push('Informe a mensagem que será enviada no WhatsApp.')
    }
    if (form.image.trim() && !isSafeHttpUrl(form.image)) {
      nextErrors.push('A URL da imagem deve começar com http:// ou https://.')
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      ctaLabel: form.ctaLabel.trim(),
      ctaType: form.ctaType,
      whatsappMessage: form.whatsappMessage.trim(),
      category: form.ctaType === 'catalogo' ? form.category : '',
      color: form.color,
      icon: form.icon,
      image: form.image.trim(),
      active: editingBanner?.active ?? true,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm text-cream-100">
        Título
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-cream-100">
        Subtítulo
        <textarea
          value={form.subtitle}
          onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
          rows={2}
          className="resize-none rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Texto do botão
          <input
            type="text"
            value={form.ctaLabel}
            onChange={(e) => setForm((prev) => ({ ...prev, ctaLabel: e.target.value }))}
            className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Ação do botão
          <select
            value={form.ctaType}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, ctaType: e.target.value as BannerCtaType }))
            }
            className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
          >
            <option value="whatsapp">Abrir WhatsApp</option>
            <option value="catalogo">Ir para o catálogo</option>
          </select>
        </label>
      </div>

      {form.ctaType === 'whatsapp' ? (
        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Mensagem do WhatsApp
          <input
            type="text"
            value={form.whatsappMessage}
            onChange={(e) => setForm((prev) => ({ ...prev, whatsappMessage: e.target.value }))}
            placeholder="Olá! Vim pelo banner do site..."
            className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
          />
        </label>
      ) : (
        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Categoria (opcional)
          <select
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value as Category | '' }))
            }
            className="rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition focus:border-gold-500"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
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
              {BANNER_ICON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-cream-100">
          Cor de destaque
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
          <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-noir-700 bg-noir-800">
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
            placeholder="https://cdn.seusite.com/banners/hero.jpg"
            className="w-full min-w-0 rounded-xl border border-noir-700 bg-noir-800 px-3.5 py-2.5 text-cream-100 outline-none transition placeholder:text-cream-300/50 focus:border-gold-500"
          />
        </div>
        <span className="text-xs text-cream-300/60">
          Dimensão recomendada: 1920×800px (proporção ~21:9), JPG/PNG/WebP até 2MB. Cole a URL
          pública do Cloudflare CDN/R2. Deixe em branco para usar o ícone ilustrado.
        </span>
      </label>

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
          {editingBanner ? 'Salvar alterações' : 'Cadastrar banner'}
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onCancel}
          className="rounded-full border border-noir-600 px-6 py-3 font-medium text-cream-300 transition hover:border-gold-500 sm:px-6"
        >
          Cancelar
        </motion.button>
      </div>
    </form>
  )
}
