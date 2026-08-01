import { AnimatePresence, motion } from 'framer-motion'
import {
  PenNewSquareLinear,
  TrashBinTrashLinear,
  EyeBold,
  EyeClosedBold,
  AltArrowUpBold,
  AltArrowDownBold,
} from 'solar-icon-set'
import type { Banner } from '@/types/banner'
import { getBannerIcon } from '@/config/bannerIcons'
import { toSafeImageSrc } from '@/utils/url'

interface BannerListProps {
  banners: Banner[]
  onEdit: (banner: Banner) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
  onMove: (id: string, direction: 'up' | 'down') => void
}

export function BannerList({ banners, onEdit, onDelete, onToggleActive, onMove }: BannerListProps) {
  const sorted = [...banners].sort((a, b) => a.order - b.order)

  return (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {sorted.map((banner, index) => {
          const Icon = getBannerIcon(banner.icon)
          const isActive = banner.active !== false
          const imageSrc = toSafeImageSrc(banner.image)
          return (
            <motion.li
              key={banner.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: isActive ? 1 : 0.55, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3 rounded-2xl border border-noir-700 bg-noir-900 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
            >
              <div className="flex items-center gap-3 sm:contents">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl text-gold-400 sm:h-16 sm:w-24"
                  style={{
                    background: `linear-gradient(150deg, ${banner.color}22, ${banner.color}55)`,
                  }}
                  aria-hidden
                >
                  {imageSrc ? (
                    <img src={imageSrc} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Icon size={24} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium text-cream-100">{banner.title}</p>
                    {!isActive && (
                      <span className="rounded-full bg-noir-700 px-2 py-0.5 text-[10px] font-medium text-cream-300">
                        Inativo
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-cream-300">
                    {banner.ctaLabel} ·{' '}
                    {banner.ctaType === 'whatsapp'
                      ? 'WhatsApp'
                      : `Catálogo${banner.category ? ` (${banner.category})` : ''}`}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => onMove(banner.id, 'up')}
                  disabled={index === 0}
                  aria-label={`Mover ${banner.title} para cima`}
                  title="Mover para cima"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-noir-600 text-cream-300 transition hover:border-gold-500 hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <AltArrowUpBold size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(banner.id, 'down')}
                  disabled={index === sorted.length - 1}
                  aria-label={`Mover ${banner.title} para baixo`}
                  title="Mover para baixo"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-noir-600 text-cream-300 transition hover:border-gold-500 hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <AltArrowDownBold size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onToggleActive(banner.id)}
                  aria-label={isActive ? `Desativar ${banner.title}` : `Ativar ${banner.title}`}
                  title={isActive ? 'Desativar' : 'Ativar'}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-noir-600 text-cream-300 transition hover:border-gold-500 hover:text-gold-400"
                >
                  {isActive ? <EyeBold size={16} /> : <EyeClosedBold size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(banner)}
                  aria-label={`Editar ${banner.title}`}
                  title="Editar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-noir-600 text-cream-300 transition hover:border-gold-500 hover:text-gold-400"
                >
                  <PenNewSquareLinear size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(banner.id)}
                  aria-label={`Excluir ${banner.title}`}
                  title="Excluir permanentemente"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-cream-300 transition hover:border-noir-600 hover:text-wine-600"
                >
                  <TrashBinTrashLinear size={16} />
                </button>
              </div>
            </motion.li>
          )
        })}
      </AnimatePresence>

      {banners.length === 0 && (
        <p className="py-10 text-center text-sm text-cream-300">Nenhum banner cadastrado ainda.</p>
      )}
    </ul>
  )
}
