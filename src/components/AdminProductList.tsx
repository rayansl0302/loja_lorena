import { AnimatePresence, motion } from 'framer-motion'
import { PenNewSquareLinear, TrashBinTrashLinear, EyeBold, EyeClosedBold } from 'solar-icon-set'
import type { Product } from '@/types/product'
import { formatBRL } from '@/config/brand'
import { getProductIcon } from '@/config/productIcons'
import { toSafeImageSrc } from '@/utils/url'

interface AdminProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
}

export function AdminProductList({
  products,
  onEdit,
  onDelete,
  onToggleActive,
}: AdminProductListProps) {
  return (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {products.map((product) => {
          const Icon = getProductIcon(product.icon)
          const isActive = product.active !== false
          const imageSrc = toSafeImageSrc(product.image)
          return (
            <motion.li
              key={product.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: isActive ? 1 : 0.55, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3 rounded-2xl border border-noir-700 bg-noir-900 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
            >
              <div className="flex items-center gap-3 sm:contents">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl text-gold-400"
                  style={{
                    background: `linear-gradient(150deg, ${product.color}22, ${product.color}55)`,
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
                    <p className="truncate font-medium text-cream-100">{product.name}</p>
                    {!isActive && (
                      <span className="rounded-full bg-noir-700 px-2 py-0.5 text-[10px] font-medium text-cream-300">
                        Inativo
                      </span>
                    )}
                    {product.featured && (
                      <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-semibold uppercase text-noir-950">
                        Novidade
                      </span>
                    )}
                    {product.fixed && (
                      <span className="rounded-full bg-cream-100/10 px-2 py-0.5 text-[10px] font-medium text-cream-100">
                        Fixa
                      </span>
                    )}
                    {product.highlight && (
                      <span className="rounded-full border border-gold-500 px-2 py-0.5 text-[10px] font-medium text-gold-400">
                        Destaque home
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-cream-300">
                    {product.category} · {formatBRL(product.price)} · {product.sizes.join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => onToggleActive(product.id)}
                  aria-label={isActive ? `Desativar ${product.name}` : `Ativar ${product.name}`}
                  title={isActive ? 'Desativar' : 'Ativar'}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-noir-600 text-cream-300 transition hover:border-gold-500 hover:text-gold-400"
                >
                  {isActive ? <EyeBold size={16} /> : <EyeClosedBold size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  aria-label={`Editar ${product.name}`}
                  title="Editar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-noir-600 text-cream-300 transition hover:border-gold-500 hover:text-gold-400"
                >
                  <PenNewSquareLinear size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(product.id)}
                  aria-label={`Excluir ${product.name}`}
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

      {products.length === 0 && (
        <p className="py-10 text-center text-sm text-cream-300">
          Nenhuma peça encontrada com esses filtros.
        </p>
      )}
    </ul>
  )
}
